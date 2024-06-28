import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { NoteService } from '../../core/services/note.service';
import { NotebookComponent } from './notebook.component';
import { Note } from '../../shared/models/Note';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ReverseStringPipe } from '../../shared/pipes/reverse-string.pipe';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Assuming ViewState is defined somewhere in your project
enum ViewState {
  Default,
  CreateNote,
  EditNote,
  DeleteNote
}

describe('NotebookComponent', () => {
  let component: NotebookComponent;
  let fixture: ComponentFixture<NotebookComponent>;
  let noteService: jasmine.SpyObj<NoteService>;

  const mockNotes: Note[] = [
    { id: '1', title: 'Note 1', content: 'Content 1' },
    { id: '2', title: 'Note 2', content: 'Content 2' },
  ];

  beforeEach(async () => {
    const noteServiceSpy = jasmine.createSpyObj('NoteService', ['fetchAllNotes', 'createNote', 'updateNote', 'deleteNote']);

    await TestBed.configureTestingModule({
      declarations: [NotebookComponent, HeaderComponent, ReverseStringPipe],
      imports: [ReactiveFormsModule, CommonModule],
      providers: [
        FormBuilder,
        { provide: NoteService, useValue: noteServiceSpy }
      ]
    }).compileComponents();

    noteService = TestBed.inject(NoteService) as jasmine.SpyObj<NoteService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookComponent);
    component = fixture.componentInstance;

    noteService.fetchAllNotes.and.returnValue(of(mockNotes));
    noteService.createNote.and.returnValue(of('Note created successfully'));
    noteService.updateNote.and.returnValue(of('Note updated successfully'));
    noteService.deleteNote.and.returnValue(of('Note deleted successfully'));

    fixture.detectChanges(); // Initial binding

    //! Initialize forms
    // component.createNoteForm = component.fb.group({
    //   title: ['', Validators.required],
    //   content: ['', Validators.required]
    // });

    // component.editNoteForm = component.fb.group({
    //   title: ['', Validators.required],
    //   content: ['', Validators.required]
    // });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notes on init', () => {
    component.ngOnInit();
    expect(component.notes.length).toBe(2);
    expect(component.notes).toEqual(mockNotes);
  });

  it('should filter notes based on search query', () => {
    component.notes = mockNotes;
    component.searchQuery = 'Note 1';
    component.filterNotes();
    expect(component.filteredNotes.length).toBe(1);
    expect(component.filteredNotes[0].title).toBe('Note 1');
  });

  it('should switch to create note view state', () => {
    component.showCreateNoteContainer();
    expect(component.viewState).toBe(ViewState.CreateNote);
  });

  it('should reset and hide create note container', () => {
    component.showCreateNoteContainer();
    component.hideCreateNoteContainer();
    expect(component.viewState).toBe(ViewState.Default);
    expect(component.createNoteForm.value).toEqual({ title: '', content: '' });
  });

  it('should create a new note', () => {
    component.createNoteForm.setValue({ title: 'New Note', content: 'New Content' });
    component.createNote();
    expect(noteService.createNote).toHaveBeenCalledWith({ title: 'New Note', content: 'New Content' });
  });

  it('should switch to edit note view state', () => {
    const note = mockNotes[0];
    component.showEditNoteContainer(note);
    expect(component.viewState).toBe(ViewState.EditNote);
    expect(component.editNoteForm.value).toEqual({ title: note.title, content: note.content });
  });

  it('should reset and hide edit note container', () => {
    component.showEditNoteContainer(mockNotes[0]);
    component.hideEditNoteContainer();
    expect(component.viewState).toBe(ViewState.Default);
    expect(component.editNoteForm.value).toEqual({ title: '', content: '' });
  });

  it('should update an existing note', () => {
    const note = mockNotes[0];
    component.showEditNoteContainer(note);
    component.editNoteForm.setValue({ title: 'Updated Note', content: 'Updated Content' });
    component.editNote();
    expect(noteService.updateNote).toHaveBeenCalledWith(note.id, { title: 'Updated Note', content: 'Updated Content' });
  });

  it('should delete a note', () => {
    const note = mockNotes[0];
    component.showDeleteNoteModal(note);
    component.deleteNote();
    expect(noteService.deleteNote).toHaveBeenCalledWith(note.id);
  });

  it('should show feedback message', fakeAsync(() => {
    component.showFeedback('Test Message');
    expect(component.feedbackMessage).toBe('Test Message');
    tick(3000); // Simulate the passage of 3 seconds
    expect(component.feedbackMessage).toBe('');
  }));

  it('should call loadNotes on create, update and delete', () => {
    spyOn(component, 'loadNotes');
    component.createNoteForm.setValue({ title: 'New Note', content: 'New Content' });
    component.createNote();
    expect(component.loadNotes).toHaveBeenCalled();

    const note = mockNotes[0];
    component.showEditNoteContainer(note);
    component.editNoteForm.setValue({ title: 'Updated Note', content: 'Updated Content' });
    component.editNote();
    expect(component.loadNotes).toHaveBeenCalled();

    component.showDeleteNoteModal(note);
    component.deleteNote();
    expect(component.loadNotes).toHaveBeenCalled();
  });

  it('should render header component', () => {
    const headerComponent: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
    expect(headerComponent).toBeTruthy();
  });
});
