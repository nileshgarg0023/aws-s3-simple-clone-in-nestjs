import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadService } from './file-upload/file-upload.service';
import { FileUploadController } from './file-upload/file-upload.controller';

@Module({
  imports: [],
  controllers: [AppController, FileUploadController],
  providers: [AppService, FileUploadService],
})
export class AppModule {}
