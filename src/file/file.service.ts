import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
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
    const config: ConfigOptions = {
      cloud_name: envConfig().cloudinary.cloudName,
      api_key: envConfig().cloudinary.apiKey,
      api_secret: envConfig().cloudinary.apiSecret,
      timeout: 60000, // 60 seconds timeout
      secure: true,
      secure_distribution: null,
      private_cdn: false,
      cname: null,
      cdn_subdomain: false,
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
      this.logger.log(`File buffer size: ${file.buffer?.length || 0} bytes`);
      
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error('File buffer is empty or undefined');
      }

      // Convert buffer to Readable Stream
      const stream = Readable.from(file.buffer);
      
      // Add error handler for the stream
      stream.on('error', (error) => {
        this.logger.error(`Stream error: ${error.message}`, error.stack);
      });

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'files',
            resource_type: 'auto',
            timeout: 60000, // 60 seconds timeout for the upload
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

        // Add error handler for the upload stream
        uploadStream.on('error', (error) => {
          this.logger.error(`Upload stream error: ${error.message}`, error.stack);
          reject(error);
        });

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