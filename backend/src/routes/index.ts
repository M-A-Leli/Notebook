import express from 'express';
import notesroutes from './NotesRoutes';

const router = express.Router();

// Mount routes
router.use('/notes', notesroutes);

export default router;
