import { Router } from 'express';
import {
  getNotes,
  getArchivedNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController';

const router = Router();

router.get('/archive', getArchivedNotes);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
