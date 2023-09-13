import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadService } from './file-upload/file-upload.service';
import { FileUploadController } from './file-upload/file-upload.controller';
import { FileRecordSchema } from './file-upload/file-record.schema';
import { FileRecordModel } from './file-upload/file-record.model';
import { FolderModel } from './file-upload/folder.modal';
import { FolderSchema } from './file-upload/folder.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb+srv://yourusername:yourpassword@s3-clone.ns07wet.mongodb.net/?retryWrites=true&w=majority', // Replace with your MongoDB connection URL
        useNewUrlParser: true,
      }),
    }),
    MongooseModule.forFeature([
      { name: 'FileRecord', schema: FileRecordSchema },
      { name: 'Folder', schema: FolderSchema },
    ]),
  ],
  controllers: [AppController, FileUploadController],
  providers: [AppService, FileUploadService, FileRecordModel, FolderModel],
})
export class AppModule {}
