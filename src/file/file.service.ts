import { Injectable } from '@nestjs/common';
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
  constructor() {
    cloudinary.config({
      cloud_name: envConfig().cloudinary.cloudName,
      api_key: envConfig().cloudinary.apiKey,
      api_secret: envConfig().cloudinary.apiSecret,
    });
  }

  async uploadFile(file: UploadedFile): Promise<string> {
    try {
      // Convert buffer to Readable Stream
      const stream = Readable.from(file.buffer);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'files',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        stream.pipe(uploadStream);
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract public_id from the URL
      const publicId = extractPublicId(fileUrl)
      
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
} 