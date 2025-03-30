import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { Readable } from 'stream';
import { FileService } from './file.service';
import { FileUploadResponse } from './file.types';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => FileUploadResponse)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload, nullable: true }) file?: FileUpload
  ) {
    console.log("FILE", file, file.createReadStream().readableLength);
    const url = await this.fileService.uploadFile({
      buffer: await this.streamToBuffer(file.createReadStream()),
      originalname: file.filename,
      mimetype: file.mimetype,
    });
    return { url };
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks = [];
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  }
} 