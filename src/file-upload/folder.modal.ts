import { Model, Document } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Folder } from './folder.schema';

@Injectable()
export class FolderModel {
  constructor(
    @InjectModel('Folder')
    private readonly folderModel: Model<Folder & Document>,
  ) {}

  async createFolder(name: string): Promise<Folder & Document> {
    if (await this.folderModel.exists({ name })) {
      throw new BadRequestException(`Folder '${name}' already exists.`);
    }
    const createdFolder = await this.folderModel.create({ name });
    return createdFolder;
  }

  async findFolder(folderName: string) {
    const folder = await this.folderModel.findOne({ name: folderName }).exec();
    return folder;
  }
  async deleteFolder(folderName: string) {
    await this.folderModel.deleteOne({ name: folderName }).exec();
  }

  async getAllFolders(): Promise<Folder[]> {
    return this.folderModel.find().exec();
  }

  // You can add more methods for working with folders as needed
}
