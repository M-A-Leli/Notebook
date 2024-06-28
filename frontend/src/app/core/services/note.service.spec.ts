import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NoteService } from './note.service';
import { Note } from '../../shared/models/Note';

describe('NoteService', () => {
  let service: NoteService;
  let httpMock: HttpTestingController;

  const mockNotes: Note[] = [
    { id: '1', title: 'Note 1', content: 'Content 1' },
    { id: '2', title: 'Note 2', content: 'Content 2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NoteService, provideHttpClient(), provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(NoteService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all notes', () => {
    service.fetchAllNotes().subscribe(notes => {
      expect(notes.length).toBe(2);
      expect(notes).toEqual(mockNotes);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/notes');
    expect(req.request.method).toBe('GET');
    req.flush(mockNotes);
  });

  it('should fetch a note by id', () => {
    const mockNote: Note = { id: '1', title: 'Note 1', content: 'Content 1' };

    service.fetchNoteById('1').subscribe(note => {
      expect(note).toEqual(mockNote);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/notes/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockNote);
  });

  it('should create a new note', () => {
    const newNote: Note = { id: '3', title: 'Note 3', content: 'Content 3' };
    const responseMessage = 'Note created successfully';

    service.createNote(newNote).subscribe(response => {
      expect(response).toBe(responseMessage);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/notes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newNote);
    req.flush(responseMessage);
  });

  it('should update a note', () => {
    const updatedNote: Partial<Note> = { title: 'Updated Note' };
    const responseMessage = 'Note updated successfully';

    service.updateNote('1', updatedNote).subscribe(response => {
      expect(response).toBe(responseMessage);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/notes/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedNote);
    req.flush(responseMessage);
  });

  it('should delete a note', () => {
    const responseMessage = 'Note deleted successfully';

    service.deleteNote('1').subscribe(response => {
      expect(response).toBe(responseMessage);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/notes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(responseMessage);
  });
});

