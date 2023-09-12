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

@Injectable()
export class FileUploadService {
  constructor() {
    this.ensureUploadsDirectoryExists(); // Create the "uploads" directory if it doesn't exist
  }

  private fileRecords: Record<string, string> = {};

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

    const { originalname, buffer } = file;
    const uniqueFilename = `${uuidv4()}_${originalname}`; // Generate a unique filename

    const filePath = `${folderPath}/${uniqueFilename}`;
    const writeStream = createWriteStream(filePath);
    writeStream.write(buffer);

    // Store the file ID in memory
    this.fileRecords[id] = `${folderName}/${uniqueFilename}`;
    console.log(this.fileRecords);

    return {
      id,
      url: `http://localhost:3000/uploads/${folderName}/${uniqueFilename}`, // Update with your server's URL
      filename: uniqueFilename,
    };
  }

  async getAllFiles(
    folderName: string,
  ): Promise<{ filename: string; size: number; url: string }[]> {
    const folderPath = `uploads/${folderName}`;

    if (!existsSync(folderPath)) {
      throw new BadRequestException(`Folder '${folderName}' does not exist.`);
    }

    try {
      const files = readdirSync(folderPath);
      const fileDetails: { filename: string; size: number; url: string }[] = [];

      for (const filename of files) {
        const filePath = `${folderPath}/${filename}`;
        const fileStats = statSync(filePath);

        fileDetails.push({
          filename,
          size: fileStats.size, // Size of the file in bytes
          url: `http://localhost:3000/uploads/${folderName}/${filename}`,
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

    await fs.rmdirSync(directory, { recursive: true });
    return `Folder '${folderName}' and its contents have been deleted.`;
  }

  async deleteFile(id: string): Promise<string> {
    const filePath = `uploads/${this.fileRecords[id]}`;

    if (!this.fileRecords[id] || !existsSync(filePath)) {
      throw new BadRequestException(`File with ID '${id}' does not exist.`);
    }

    // Delete the file
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file with ID '${id}'.`);
    }

    // Optionally, delete the folder if it's empty
    const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));

    try {
      const filesInFolder = readdirSync(folderPath);

      if (filesInFolder.length === 0) {
        rmdirSync(folderPath);
      }
    } catch (error) {
      // Handle any errors that occur while checking the folder
      console.error(`Error checking folder: ${error}`);
    }

    // Remove the file ID from memory
    delete this.fileRecords[id];

    return `File with ID '${id}' has been deleted.`;
  }
}
