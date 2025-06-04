import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
import OpenAI from 'openai';
import { envConfig } from 'src/dynamic-modules';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly openai: OpenAI;

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

    // Initialize OpenAI
    this.openai = new OpenAI({
      apiKey: envConfig().openai.apiKey,
    });
  }

  async uploadFile(file: UploadedFile): Promise<string> {
    try {
      this.logger.log(`Starting file upload: ${file.originalname} (${file.mimetype})`);
      this.logger.log(`File buffer size: ${file.buffer?.length || 0} bytes`);
      
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error('File buffer is empty or undefined');
      }

      if (!file.mimetype) {
        throw new Error('File mimetype is undefined');
      }

      // Validate Cloudinary configuration
      if (!envConfig().cloudinary.cloudName || !envConfig().cloudinary.apiKey || !envConfig().cloudinary.apiSecret) {
        throw new Error('Cloudinary configuration is incomplete');
      }

      const base64Data = file.buffer.toString('base64');
      if (!base64Data) {
        throw new Error('Failed to convert file buffer to base64');
      }

      const uploadData = `data:${file.mimetype};base64,${base64Data}`;
      
      // Generate a unique public_id based on filename and timestamp
      const timestamp = new Date().getTime();
      const publicId = `${file.originalname.split('.')[0]}_${timestamp}`;

      const result = await cloudinary.uploader.upload(uploadData, {
        public_id: publicId,
        folder: 'files',
        resource_type: 'auto',
        timeout: 60000, // 60 seconds timeout for the upload
      }).catch((error) => {
        this.logger.error('Cloudinary upload error:', error);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
      });

      if (!result || !result.secure_url) {
        throw new Error('Cloudinary upload succeeded but no URL was returned');
      }

      // Optimize the URL for delivery
      const optimizedUrl = cloudinary.url(result.public_id, {
        fetch_format: 'auto',
        quality: 'auto',
        secure: true
      });

      this.logger.log(`File uploaded successfully: ${optimizedUrl}`);
      return optimizedUrl;
    } catch (error) {
      const errorMessage = error.message || 'Unknown error occurred';
      const errorDetails = error.response?.body || error.stack || 'No additional details available';
      this.logger.error(`Failed to upload file: ${errorMessage}`, errorDetails);
      throw new Error(`Failed to upload file: ${errorMessage}`);
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

  async generateAndUploadImage(prompt: string): Promise<string> {
    try {
      this.logger.log(`Generating image for prompt: ${prompt}`);

      // Generate image using OpenAI
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json"
      });

      const imageData = response.data[0].b64_json;
      if (!imageData) {
        throw new Error('No image data received from OpenAI');
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(imageData, 'base64');

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageData}`,
        {
          folder: 'ai-generated',
          resource_type: 'image',
          timeout: 60000,
        }
      );

      this.logger.log(`AI-generated image uploaded successfully: ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      this.logger.error(`Failed to generate and upload image: ${error.message}`, error.stack);
      throw new Error(`Failed to generate and upload image: ${error.message}`);
    }
  }
} 