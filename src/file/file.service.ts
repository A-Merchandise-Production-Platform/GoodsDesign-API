import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
import OpenAI from 'openai';
import { envConfig } from 'src/dynamic-modules';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly openai: OpenAI;
  private readonly storage;

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

    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyClWMBfKK-pABwkKFQWXyVgSEVcJHyJkmc",
      authDomain: "koi-farm-shop-fd1ef.firebaseapp.com",
      projectId: "koi-farm-shop-fd1ef",
      storageBucket: "koi-farm-shop-fd1ef.appspot.com",
      messagingSenderId: "669414724581",
      appId: "1:669414724581:web:a4beefc16c67334d09d50c",
      measurementId: "G-BEH6L3MXV0",
    };

    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  }

  async uploadFile(file: UploadedFile): Promise<string> {
    try {
      this.logger.log(`[FileUpload] Starting file upload process`);
      this.logger.log(`[FileUpload] File details - Name: ${file.originalname}, Type: ${file.mimetype}, Size: ${file.buffer?.length || 0} bytes`);
      
      if (!file.buffer || file.buffer.length === 0) {
        this.logger.error('[FileUpload] Error: File buffer is empty or undefined');
        throw new Error('File buffer is empty or undefined');
      }

      if (!file.mimetype) {
        this.logger.error('[FileUpload] Error: File mimetype is undefined');
        throw new Error('File mimetype is undefined');
      }

      // Validate Cloudinary configuration
      this.logger.log('[FileUpload] Validating Cloudinary configuration');
      const cloudinaryConfig = envConfig().cloudinary;
      this.logger.log(`[FileUpload] Cloudinary config - CloudName: ${cloudinaryConfig.cloudName ? 'Set' : 'Not Set'}, APIKey: ${cloudinaryConfig.apiKey ? 'Set' : 'Not Set'}, APISecret: ${cloudinaryConfig.apiSecret ? 'Set' : 'Not Set'}`);
      
      if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
        this.logger.error('[FileUpload] Error: Cloudinary configuration is incomplete');
        throw new Error('Cloudinary configuration is incomplete');
      }

      this.logger.log('[FileUpload] Converting file buffer to base64');
      const base64Data = file.buffer.toString('base64');
      if (!base64Data) {
        this.logger.error('[FileUpload] Error: Failed to convert file buffer to base64');
        throw new Error('Failed to convert file buffer to base64');
      }
      this.logger.log(`[FileUpload] Base64 conversion successful, length: ${base64Data.length}`);

      const uploadData = `data:${file.mimetype};base64,${base64Data}`;
      
      // Generate a unique public_id based on filename and timestamp
      const timestamp = new Date().getTime();
      const publicId = `${file.originalname.split('.')[0]}_${timestamp}`;
      this.logger.log(`[FileUpload] Generated public_id: ${publicId}`);

      this.logger.log('[FileUpload] Initiating Cloudinary upload');
      const result = await cloudinary.uploader.upload(uploadData, {
        public_id: publicId,
        folder: 'files',
        resource_type: 'auto',
        timeout: 60000, // 60 seconds timeout for the upload
      }).catch((error) => {
        this.logger.error('[FileUpload] Cloudinary upload error:', error);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
      });

      if (!result || !result.secure_url) {
        this.logger.error('[FileUpload] Error: Cloudinary upload succeeded but no URL was returned');
        throw new Error('Cloudinary upload succeeded but no URL was returned');
      }
      this.logger.log(`[FileUpload] Cloudinary upload successful, received URL: ${result.secure_url}`);

      // Optimize the URL for delivery
      this.logger.log('[FileUpload] Optimizing URL for delivery');
      const optimizedUrl = cloudinary.url(result.public_id, {
        fetch_format: 'auto',
        quality: 'auto',
        secure: true
      });

      this.logger.log(`[FileUpload] File upload process completed successfully. Final URL: ${optimizedUrl}`);
      return optimizedUrl;
    } catch (error) {
      const errorMessage = error.message || 'Unknown error occurred';
      const errorDetails = error.response?.body || error.stack || 'No additional details available';
      this.logger.error(`[FileUpload] Failed to upload file: ${errorMessage}`, errorDetails);
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
      
      // Create a temporary file name
      const randomName = Math.random().toString(36).substring(7);
      const fileName = `generated_${randomName}.png`;
      
      // Create a reference to the storage location
      const storageRef = ref(this.storage, `images-ai/${fileName}`);
      
      // Upload the buffer to Firebase Storage
      const uploadTask = await uploadBytesResumable(storageRef, buffer);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      this.logger.log(`Image uploaded successfully to Firebase Storage: ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      this.logger.error(`Failed to generate and upload image: ${error.message}`, error.stack);
      throw new Error(`Failed to generate and upload image: ${error.message}`);
    }
  }
} 