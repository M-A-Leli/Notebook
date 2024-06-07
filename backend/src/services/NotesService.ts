import createError from 'http-errors';
import { dbInstance } from '../database/dbInit';
import * as sql from 'mssql';
import Note from '../models/Note';
import { v4 as uuidv4 } from 'uuid';

class NoteService {
  public async getAllNotes(): Promise<Note[]> {
    try {
      const pool = await dbInstance.connect();
      const result = await pool.request().execute('GetAllNotes');

      if (result.recordset.length === 0) {
        throw createError(404, 'No Notes at the moment');
      }

      return result.recordset.map((record: any) => new Note(record.Id, record.Title, record.Content));
    } catch (error) {
      if (error instanceof createError.HttpError) {
        throw error;
      } else if (error instanceof Error) {
        throw createError(500, `Unexpected error: ${error.message}`);
      } else {
        throw createError(500, 'Unexpected error occurred');
      }
    }
  }

  public async getNoteById(noteId: string): Promise<Note> {
    try {
      const pool = await dbInstance.connect();
      const result = await pool.request()
        .input('Id', sql.UniqueIdentifier, noteId)
        .execute('GetNoteById');

      if (!result.recordset[0]) {
        throw createError(404, 'Note not found');
      }

      const record = result.recordset[0];
      return new Note(record.Id, record.Title, record.Content);
    } catch (error) {
      if (error instanceof createError.HttpError) {
        throw error;
      } else if (error instanceof Error) {
        throw createError(500, `Unexpected error: ${error.message}`);
      } else {
        throw createError(500, 'Unexpected error occurred');
      }
    }
  }

  public async createNote(title: string, content: string): Promise<Note> {
    try {
      const id = uuidv4();
      const pool = await dbInstance.connect();
      const result = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('Title', sql.NVarChar(50), title)
        .input('Content', sql.NVarChar(50), content)
        .execute('CreateNote');

      const record = result.recordset[0];
      return new Note(record.Id, record.Title, record.Content);
    } catch (error) {
      if (error instanceof createError.HttpError) {
        throw error;
      } else if (error instanceof Error) {
        throw createError(500, `Unexpected error: ${error.message}`);
      } else {
        throw createError(500, 'Unexpected error occurred');
      }
    }
  }

  public async updateNote(note: Note): Promise<Note> {
    try {
      const pool = await dbInstance.connect();
      const existingNote = await pool.request()
        .input('Id', sql.UniqueIdentifier, note.id)
        .execute('GetNoteById');

      if (!existingNote.recordset[0]) {
        throw createError(404, 'Note not found');
      }

      const result = await pool.request()
        .input('Id', sql.UniqueIdentifier, note.id)
        .input('Title', sql.NVarChar(50), note.title)
        .input('Content', sql.NVarChar(50), note.content)
        .execute('UpdateNote');

      const record = result.recordset[0];
      return new Note(record.Id, record.Title, record.Content);
    } catch (error) {
      if (error instanceof createError.HttpError) {
        throw error;
      } else if (error instanceof Error) {
        throw createError(500, `Unexpected error: ${error.message}`);
      } else {
        throw createError(500, 'Unexpected error occurred');
      }
    }
  }

  public async deleteNote(id: string): Promise<boolean> {
    try {
      const pool = await dbInstance.connect();
      const existingNote = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .execute('GetNoteById');

      if (!existingNote.recordset[0]) {
        throw createError(404, 'Note not found');
      }

      await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .execute('DeleteNote');

      return true;
    } catch (error) {
      if (error instanceof createError.HttpError) {
        throw error;
      } else if (error instanceof Error) {
        throw createError(500, `Unexpected error: ${error.message}`);
      } else {
        throw createError(500, 'Unexpected error occurred');
      }
    }
  }
}

export default new NoteService();
