import { Schema, Document } from 'mongoose';

export const FolderSchema = new Schema({
  name: String,
  // Add other folder-related properties if needed
});

export interface Folder extends Document {
  name: string;
}
