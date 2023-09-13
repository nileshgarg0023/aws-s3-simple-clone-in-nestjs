// file-record.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileRecord } from './file-record.schema';
import { Folder } from './folder.schema';

@Injectable()
export class FileRecordModel {
  constructor(
    @InjectModel('FileRecord')
    private readonly fileRecordModel: Model<FileRecord>,
  ) {}

  async createFileRecord(
    fileId: string,
    filename: string,
    folderName: string,
    url: string,
    filePath: string,
    folder: Folder,
  ): Promise<Document> {
    const createdFileRecord = new this.fileRecordModel({
      fileId,
      filename,
      folderName,
      url,
      filePath,
      folder,
    });
    return createdFileRecord.save();
  }

  async getFileRecord(fileId: string): Promise<FileRecord | null> {
    return this.fileRecordModel.findOne({ fileId: fileId }).exec();
  }

  async deleteFileRecord(fileId: string): Promise<void> {
    await this.fileRecordModel.deleteOne({ fileId }).exec();
  }

  async deleteFile(filePath: string) {
    await this.fileRecordModel.deleteOne({ filePath }).exec();
  }

  async getfileFromFolder(folderName: string) {
    return await this.fileRecordModel.find({ folderName }).exec();
  }
}
