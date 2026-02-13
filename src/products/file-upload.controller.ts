import { Controller, Get, Query } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  // Endpoint to generate a presigned URL
  @Get('presigned-url')
  async getPresignedUrl(
    @Query('fileName') fileName: string,
    @Query('fileType') fileType: string,
  ): Promise<{ presignedUrl: string }> {
    const presignedUrl = await this.fileUploadService.generatePresignedUrl(
      fileName,
      fileType,
    );
    return { presignedUrl };
  }
}
