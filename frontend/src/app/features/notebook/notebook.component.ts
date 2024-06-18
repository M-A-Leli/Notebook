import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Note } from '../../shared/models/Note';
import { NoteService } from '../../core/services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReverseStringPipe } from '../../shared/pipes/reverse-string.pipe';

enum ViewState {
  Default,
  SingleNote,
  CreateNote,
  EditNote,
  DeleteModal
}

@Component({
  selector: 'app-notebook',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, ReactiveFormsModule, ReverseStringPipe],
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.css']
})
export class NotebookComponent implements OnInit {
  notes: Note[] = [];
  selectedNoteId: string | null = null;
  selectedNote: Note | null = null;
  viewState = ViewState.Default;
  createNoteForm: FormGroup;
  editNoteForm: FormGroup;
  feedbackMessage: string | null = null;
  ViewState = ViewState; // Expose the enum to the template

  constructor(private noteService: NoteService, private fb: FormBuilder) {
    this.createNoteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    this.editNoteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.fetchAllNotes().subscribe(notes => {
      this.notes = notes;
    });
  }

  viewNote(note: Note): void {
    this.selectedNote = note;
    this.viewState = ViewState.SingleNote;
  }

  showCreateNoteContainer(): void {
    this.viewState = ViewState.CreateNote;
  }

  hideCreateNoteContainer(): void {
    this.viewState = ViewState.Default;
    this.createNoteForm.reset();
  }

  showEditNoteContainer(note: Note): void {
    this.selectedNote = note;
    this.selectedNoteId = note.id as string; // Ensure selectedNoteId is set
    this.editNoteForm.setValue({
      title: note.title,
      content: note.content
    });
    this.viewState = ViewState.EditNote;
  }

  hideEditNoteContainer(): void {
    this.viewState = ViewState.Default;
    this.editNoteForm.reset();
    this.selectedNote = null;
  }

  showDeleteNoteModal(note: Note): void {
    this.selectedNote = note;
    this.selectedNoteId = note.id as string; // Ensure selectedNoteId is set
    this.viewState = ViewState.DeleteModal;
  }

  hideDeleteNoteModal(): void {
    this.viewState = ViewState.Default;
    this.selectedNote = null;
  }

  createNote(): void {
    if (this.createNoteForm.valid) {
      this.noteService.createNote(this.createNoteForm.value).subscribe(() => {
        this.loadNotes();
        this.hideCreateNoteContainer();
        this.showFeedback('Note created successfully!');
      });
    }
  }

  editNote(): void {
    if (this.editNoteForm.valid && this.selectedNote && this.selectedNoteId) {
      this.noteService.updateNote(this.selectedNoteId, this.editNoteForm.value).subscribe(() => {
        this.loadNotes();
        this.hideEditNoteContainer();
        this.showFeedback('Note updated successfully!');
      });
    }
  }

  deleteNote(): void {
    if (this.selectedNote && this.selectedNoteId) {
      this.noteService.deleteNote(this.selectedNoteId).subscribe(() => {
        this.loadNotes();
        this.hideDeleteNoteModal();
        this.showFeedback('Note deleted successfully!');
      });
    }
  }

  onBack(): void {
    this.viewState = ViewState.Default;
  }

  onEditClick(event: Event, note: Note): void {
    event.preventDefault();
    this.showEditNoteContainer(note);
  }

  onDeleteClick(event: Event, note: Note): void {
    event.preventDefault();
    this.showDeleteNoteModal(note);
  }

  showFeedback(message: string): void {
    this.feedbackMessage = message;
    setTimeout(() => {
      // this.feedbackMessage = null;
      this.feedbackMessage = '';
    }, 3000); // Hide the feedback message after 3 seconds
  }
}
