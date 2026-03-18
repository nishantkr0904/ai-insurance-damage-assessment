import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { ApiError } from '../middlewares/errorHandler.js';

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const uploadService = {
  async uploadImage(
    file: Express.Multer.File,
    claimId: string
  ): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const key = `claims/${claimId}/${uuidv4()}.${fileExtension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: config.aws.s3Bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);

      const imageUrl = `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
      logger.info(`Image uploaded successfully: ${imageUrl}`);

      return imageUrl;
    } catch (error) {
      logger.error('S3 upload error:', error);
      throw new ApiError('Failed to upload image', 500);
    }
  },

  async uploadMultipleImages(
    files: Express.Multer.File[],
    claimId: string
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, claimId));
    return Promise.all(uploadPromises);
  },

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const url = new URL(imageUrl);
      const key = url.pathname.substring(1); // Remove leading slash

      const command = new DeleteObjectCommand({
        Bucket: config.aws.s3Bucket,
        Key: key,
      });

      await s3Client.send(command);
      logger.info(`Image deleted successfully: ${imageUrl}`);
    } catch (error) {
      logger.error('S3 delete error:', error);
      throw new ApiError('Failed to delete image', 500);
    }
  },

  async getPresignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  },

  validateFile(file: Express.Multer.File): void {
    if (!config.upload.allowedMimeTypes.includes(file.mimetype)) {
      throw new ApiError(
        `Invalid file type. Allowed types: ${config.upload.allowedMimeTypes.join(', ')}`,
        400
      );
    }

    if (file.size > config.upload.maxFileSize) {
      throw new ApiError(
        `File too large. Maximum size: ${config.upload.maxFileSize / 1024 / 1024}MB`,
        400
      );
    }
  },
};
