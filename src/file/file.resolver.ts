import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { Readable } from 'stream';
import { FileService } from './file.service';
import { FileUploadResponse } from './file.types';

@Resolver()
export class FileResolver {
  private readonly logger = new Logger(FileResolver.name);

  constructor(private readonly fileService: FileService) {}

  @Mutation(() => FileUploadResponse)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload, nullable: true }) file?: FileUpload
  ) {
    if (!file) {
      throw new Error('No file provided');
    }

    this.logger.log(`Received file: ${file.filename} (${file.mimetype})`);
    
    try {
      const stream = file.createReadStream();
      this.logger.log(`Stream created, readable length: ${stream.readableLength}`);
      
      const buffer = await this.streamToBuffer(stream);
      this.logger.log(`Buffer created, size: ${buffer.length} bytes`);

      const url = await this.fileService.uploadFile({
        buffer,
        originalname: file.filename,
        mimetype: file.mimetype,
      });
      
      return { url };
    } catch (error) {
      this.logger.error(`Failed to process file upload: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async deleteFile(
    @Args({ name: 'fileUrl', type: () => String }) fileUrl: string
  ): Promise<boolean> {
    try {
      await this.fileService.deleteFile(fileUrl);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      let totalSize = 0;

      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
        totalSize += chunk.length;
        this.logger.debug(`Received chunk of size: ${chunk.length} bytes, total: ${totalSize} bytes`);
      });

      stream.on('end', () => {
        this.logger.log(`Stream ended, total size: ${totalSize} bytes`);
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      stream.on('error', (error) => {
        this.logger.error(`Stream error: ${error.message}`, error.stack);
        reject(error);
      });
    });
  }
} 