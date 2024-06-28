import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../../shared/models/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private baseURL: string = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  fetchAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseURL}/notes`);
  }

  fetchNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.baseURL}/notes/${id}`);
  }

  createNote(note: Note): Observable<string> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post<string>(`${this.baseURL}/notes`, note, { headers });
  }

  updateNote(id: string, note: Partial<Note>): Observable<string> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.put<string>(`${this.baseURL}/notes/${id}`, note, { headers });
  }

  deleteNote(id: string): Observable<string> {
    return this.http.delete<string>(`${this.baseURL}/notes/${id}`);
  }
}
