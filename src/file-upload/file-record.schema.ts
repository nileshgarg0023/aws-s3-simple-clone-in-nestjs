import { Schema, model } from 'mongoose';
import { Folder } from './folder.schema';

export interface FileRecord extends Document {
  fileId: string;
  filename: string;
  folderName: string;
  url: string; 
  filePath: string; 
  folder: Folder;
}

export const FileRecordSchema = new Schema({
  fileId: String,
  filename: String,
  folderName: String,
  url: String,
  filePath: String,
  folder: { type: Schema.Types.ObjectId, ref: 'Folder' },
});

