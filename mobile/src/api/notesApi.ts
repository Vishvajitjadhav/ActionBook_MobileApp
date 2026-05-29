import axios from 'axios';
import type { Note, NoteColor } from '../types';

// Replace with your computer's local IP address when testing on a real device
// e.g. 'http://192.168.1.105:5000/api'
// For Android emulator use: 'http://10.0.2.2:5000/api'
const BASE_URL = 'http://172.16.100.123:5000/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export interface NotePayload {
  title?: string;
  body?: string;
  color?: NoteColor;
  isPinned?: boolean;
  isArchived?: boolean;
}

export const fetchNotes = (search?: string): Promise<Note[]> =>
  api.get('/notes', { params: search ? { search } : {} }).then((r) => r.data);

export const fetchArchivedNotes = (): Promise<Note[]> =>
  api.get('/notes/archive').then((r) => r.data);

export const fetchNoteById = (id: string): Promise<Note> =>
  api.get(`/notes/${id}`).then((r) => r.data);

export const createNote = (payload: NotePayload): Promise<Note> =>
  api.post('/notes', payload).then((r) => r.data);

export const updateNote = (id: string, payload: NotePayload): Promise<Note> =>
  api.put(`/notes/${id}`, payload).then((r) => r.data);

export const deleteNote = (id: string): Promise<void> =>
  api.delete(`/notes/${id}`).then((r) => r.data);
