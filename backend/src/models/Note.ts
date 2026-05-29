import { Schema, model, Document } from 'mongoose';

export type NoteColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple';

export interface INote extends Document {
  title: string;
  body: string;
  color: NoteColor;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    color: {
      type: String,
      enum: ['default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple'],
      default: 'default',
    },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Note = model<INote>('Note', noteSchema);
