import { Request, Response, NextFunction } from 'express';
import { Note } from '../models/Note';

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const filter: Record<string, unknown> = { isArchived: false };

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { body: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

export const getArchivedNotes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find({ isArchived: true }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, body, color, isPinned } = req.body;
    const note = await Note.create({ title, body, color, isPinned });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, body, color, isPinned, isArchived } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, body, color, isPinned, isArchived },
      { new: true, runValidators: true }
    );
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};
