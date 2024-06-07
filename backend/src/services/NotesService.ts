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

      return result.recordset.map((record: any) => new Note(record.Id, record.Title, record.Content, record.createdAt, record.updatedAt));
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
      return new Note(record.Id, record.Title, record.Content, record.createdAt, record.updatedAt);
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

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('No record returned from the database.');
      }

      const record = result.recordset[0];
      return new Note(record.Id, record.Title, record.Content, record.createdAt, record.updatedAt);
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

      // Check if the note exists
      const existingNoteResult = await pool.request()
        .input('Id', sql.UniqueIdentifier, note.id)
        .execute('GetNoteById');

      if (!existingNoteResult.recordset[0]) {
        throw createError(404, 'Note not found');
      }

      // Update the note
      const result = await pool.request()
        .input('Id', sql.UniqueIdentifier, note.id)
        .input('Title', sql.NVarChar(50), note.title)
        .input('Content', sql.NVarChar(50), note.content)
        .execute('UpdateNote');

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('No record returned from the database.');
      }

      const record = result.recordset[0];
      return new Note(record.Id, record.Title, record.Content, record.CreatedAt, record.UpdatedAt);
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
