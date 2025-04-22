import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from 'src/dynamic-modules';
import { Readable } from 'stream';
import { extractPublicId } from 'cloudinary-build-url'

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor() {
    const config = {
      cloud_name: envConfig().cloudinary.cloudName,
      api_key: envConfig().cloudinary.apiKey,
      api_secret: envConfig().cloudinary.apiSecret,
    };
    
    this.logger.log(`Initializing Cloudinary with config: ${JSON.stringify({
      ...config,
      api_secret: '***' // Hide sensitive data in logs
    })}`);
    
    cloudinary.config(config);
  }

  async uploadFile(file: UploadedFile): Promise<string> {
    try {
      this.logger.log(`Starting file upload: ${file.originalname} (${file.mimetype})`);
      
      // Convert buffer to Readable Stream
      const stream = Readable.from(file.buffer);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'files',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              this.logger.error(`Cloudinary upload failed: ${error.message}`, error.stack);
              return reject(error);
            }
            this.logger.log(`File uploaded successfully: ${result.secure_url}`);
            resolve(result.secure_url);
          }
        );

        stream.pipe(uploadStream);
      });
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      this.logger.log(`Attempting to delete file: ${fileUrl}`);
      
      // Extract public_id from the URL
      const publicId = extractPublicId(fileUrl)
      this.logger.log(`Extracted public_id: ${publicId}`);
      
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`File deleted successfully: ${publicId}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
} 