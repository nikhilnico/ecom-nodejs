import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; // To generate unique file names
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private s3: AWS.S3;
  private readonly BUCKET_NAME = process.env.AWS_BUCKET_NAME;

  constructor() {
    // Initialize AWS S3 instance
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  // Generate a presigned URL for file upload
  async generatePresignedUrl(fileName: string, fileType: string): Promise<string> {
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: `${uuidv4()}${path.extname(fileName)}`, // Unique file name
      Expires: 60 * 5, // URL expires in 5 minutes
      ContentType: fileType,
      ACL: 'public-read', // Set to 'public-read' to make the file publicly accessible
    };

    // Generate presigned URL
    const uploadUrl = await this.s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
  }
}
