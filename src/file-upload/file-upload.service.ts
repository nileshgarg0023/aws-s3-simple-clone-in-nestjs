import { BadRequestException, Injectable } from '@nestjs/common';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  statSync,
} from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { FileRecordModel } from './file-record.model';
import { FolderModel } from './folder.modal';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileRecordModel: FileRecordModel,
    private readonly folderModel: FolderModel,
  ) {
    this.ensureUploadsDirectoryExists(); // Create the "uploads" directory if it doesn't exist
  }

  private ensureUploadsDirectoryExists() {
    const directory = 'uploads';
    if (!existsSync(directory)) {
      mkdirSync(directory);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<{ id: string; url: string; filename: string }> {
    // Validate folder existence
    const id = uuidv4();
    const folderPath = `uploads/${folderName}`;
    if (!existsSync(folderPath)) {
      throw new BadRequestException(`Folder '${folderName}' does not exist.`);
    }

    // If the folder doesn't exist in MongoDB, create it
    const folder = await this.folderModel.findFolder(folderName);

    const { originalname, buffer } = file;
    const uniqueFilename = `${uuidv4()}_${originalname}`; // Generate a unique filename

    const url = `http://localhost:3000/uploads/${folderName}/${uniqueFilename}`;
    const filePath = `${folderPath}/${uniqueFilename}`;
    const writeStream = createWriteStream(filePath);
    writeStream.write(buffer);

    // Store the file record in MongoDB with URL and file path
    if (folder) {
      await this.fileRecordModel.createFileRecord(
        id,
        uniqueFilename,
        folderName,
        url,
        filePath,
        folder._id,
      );
    } else {
      throw new BadRequestException('folder with this name does not exists');
    }

    return {
      id,
      url,
      filename: uniqueFilename,
    };
  }

  async getAllFolders() {
    return await this.folderModel.getAllFolders();
  }

  async getFileById(id: string) {
    return await this.fileRecordModel.getFileRecord(id);
  }

  async getAllFiles(
    folderName: string,
  ): Promise<{ fileId: string; filename: string; url: string }[]> {
    try {
      const folderPath = `uploads/${folderName}`;
      if (!existsSync(folderPath)) {
        throw new BadRequestException(`Folder '${folderName}' does not exist.`);
      }

      // If the folder doesn't exist in MongoDB, create it
      const folder = await this.folderModel.findFolder(folderName);

      if (!folder) {
        throw new BadRequestException(`Folder '${folderName}' does not exist.`);
      }

      // Query the database to find all files associated with the folder
      const files = await this.fileRecordModel.getfileFromFolder(folderName);

      if (!files || files.length === 0) {
        throw new BadRequestException(
          `No files found in folder '${folderName}'.`,
        );
      }

      const fileDetails: { fileId: string; filename: string; url: string }[] =
        [];

      for (const file of files) {
        fileDetails.push({
          fileId: file.fileId,
          filename: file.filename,
          url: file.url,
        });
      }

      return fileDetails;
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve files from folder '${folderName}'.`,
      );
    }
  }

  async deleteFolder(folderName: string): Promise<string> {
    const directory = `uploads/${folderName}`;

    if (!fs.existsSync(directory)) {
      throw new BadRequestException(`Folder '${folderName}' does not exist.`);
    }

    // Delete all files in the folder and their associated records
    const filesInFolder = readdirSync(directory);
    for (const file of filesInFolder) {
      const filePath = `${directory}/${file}`;
      // Delete the file from the disk
      fs.unlinkSync(filePath);
      // Delete the associated file record from the database
      await this.fileRecordModel.deleteFile(filePath);
    }

    // Delete the folder and its associated records from the database
    await this.folderModel.deleteFolder(folderName);

    // Delete the folder and its contents from the filesystem
    fs.rmdirSync(directory, { recursive: true });

    return `Folder '${folderName}' and its contents have been deleted.`;
  }

  async deleteFile(id: string): Promise<string> {
    // Fetch the file record from MongoDB
    const fileRecord = await this.fileRecordModel.getFileRecord(id);

    if (!fileRecord) {
      throw new BadRequestException(`File with ID '${id}' does not exist.`);
    }

    const { filePath } = fileRecord;

    // Delete the file
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file with ID '${id}'.`);
    }

    // Optionally, delete the folder if it's empty
    // const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));

    // try {
    //   const filesInFolder = readdirSync(folderPath);

    //   if (filesInFolder.length === 0) {
    //     rmdirSync(folderPath);
    //   }
    // } catch (error) {
    //   // Handle any errors that occur while checking the folder
    //   console.error(`Error checking folder: ${error}`);
    // }

    // Delete the file record from MongoDB
    await this.fileRecordModel.deleteFileRecord(id);

    return `File with ID '${id}' has been deleted.`;
  }
}
