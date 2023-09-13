import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import * as fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import { FolderModel } from './folder.modal';
import { Folder } from './folder.schema';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly folderModel: FolderModel,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() { folderName }: { folderName: string },
  ): Promise<{ id: string; message: string; url: string }> {
    const { id, url, filename } = await this.fileUploadService.uploadFile(
      file,
      folderName,
    );
    return { id, message: `File uploaded as ${filename}`, url };
  }

  @Post('create-folder')
  async createFolder(
    @Body() { folderName }: { folderName: string },
  ): Promise<string> {
    try {
      const directory = `uploads/${folderName}`;

      if (!existsSync('uploads')) {
        mkdirSync('uploads');
      }

      if (fs.existsSync(directory)) {
        throw new BadRequestException(`Folder '${folderName}' already exists.`);
      }
      // Create the folder in MongoDB using the FolderModel
      await this.folderModel.createFolder(folderName);

      fs.mkdirSync(directory);

      return `Folder '${folderName}' created successfully.`;
    } catch (error) {
      throw new BadRequestException(`Unable to create folder '${folderName}'.`);
    }
  }

  @Get('getallfolders')
  async getAllFolders(): Promise<Folder[]> {
    return this.fileUploadService.getAllFolders();
  }

  @Get('getfilebyid/:id')
  async getFileById(@Param('id') id: string) {
    return this.fileUploadService.getFileById(id);
  }

  @Get('allfilesfromfolder/:folderName')
  async getAllFiles(
    @Param('folderName') folderName: string,
  ): Promise<{ fileId: string; filename: string; url: string }[]> {
    return this.fileUploadService.getAllFiles(folderName);
  }

  @Delete('folder/:folderName')
  deleteFolder(@Param('folderName') folderName: string): Promise<string> {
    try {
      return this.fileUploadService.deleteFolder(folderName);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to delete folder.');
    }
  }

  @Delete('file/:id')
  deleteFile(@Param('id') id: string): Promise<string> {
    try {
      return this.fileUploadService.deleteFile(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to delete file.');
    }
  }
}
