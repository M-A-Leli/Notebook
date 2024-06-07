import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import NoteService from '../services/NotesService';
import Note from '../models/Note';

class NoteController {
    constructor() {
        this.fetchAllNotes = this.fetchAllNotes.bind(this);
        this.fetchNoteById = this.fetchNoteById.bind(this);
        this.createNote = this.createNote.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
    }

    async fetchAllNotes(req: Request, res: Response, next: NextFunction) {
        try {
            const notes = await NoteService.getAllNotes();
            res.json(notes.map(note => this.transformNote(note)));
        } catch (error) {
            next(error);
        }
    }

    async fetchNoteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const note = await NoteService.getNoteById(id);
            res.json(this.transformNote(note));
        } catch (error) {
            next(error);
        }
    }

    async createNote(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newNote = await NoteService.createNote(req.body.title, req.body.content);
            res.status(201).json(this.transformNote(newNote));
        } catch (error) {
            next(error);
        }
    }

    async updateNote(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const noteToUpdate = new Note(
                id,
                req.body.title,
                req.body.content
            );
            const updatedNote = await NoteService.updateNote(noteToUpdate);
            res.json(this.transformNote(updatedNote));
        } catch (error) {
            next(error);
        }
    }

    async deleteNote(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletedNote = await NoteService.deleteNote(id); //!
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    private transformNote(note: Note) {
        return {
            id: note.id,
            title: note.title,
            content: note.content
        };
    }
}

export default new NoteController();
