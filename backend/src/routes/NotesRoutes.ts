import { Router } from 'express';
import NotesController from '../controllers/NotesController';
import { validateNoteInput } from '../Middleware/InputValidation';

const router = Router();

router.get('/', NotesController.fetchAllNotes);
router.get('/:id', NotesController.fetchNoteById);
router.post('/', validateNoteInput, NotesController.createNote);
router.put('/:id', validateNoteInput, NotesController.updateNote);
router.delete('/:id', NotesController.deleteNote);

export default router;
