import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Note } from '../../shared/models/Note';
import { NoteService } from '../../core/services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notebook',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './notebook.component.html',
  styleUrl: './notebook.component.css'
})
export class NotebookComponent {
  notes: Note[] = [];
  selectedNoteId: string | null = null;
  selectedNote: Note | null = null;
  showDefaultMessage = true;
  showSingleNote = false;
  showCreateNote = false;
  showEditNote = false;
  showDeleteModal = false;
  newNote: Partial<Note> = { title: '', content: '' };
  editedNote: Partial<Note> = { title: '', content: '' };

  constructor(private noteService: NoteService) {}

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
    this.showSingleNote = true;
  }

  showCreateNoteContainer(): void {
    this.showCreateNote = true;
    this.showDefaultMessage = false;
  }

  hideCreateNoteContainer(): void {
    this.showCreateNote = false;
    this.showDefaultMessage = true;
  }

  showEditNoteContainer(note: Note): void {
    this.selectedNote = note;
    this.editedNote = { ...note };
    this.showEditNote = true;
    this.showDefaultMessage = false;
    this.showSingleNote = false;
  }

  hideEditNoteContainer(): void {
    this.showEditNote = false;
    this.showDefaultMessage = true;
    this.selectedNote = null;
  }

  showDeleteNoteModal(note: Note): void {
    this.selectedNote = note;
    this.showSingleNote = false;
    this.showDeleteModal = true;
  }

  hideDeleteNoteModal(): void {
    this.showDeleteModal = false;
    this.selectedNote = null;
  }

  createNote(): void {
    this.noteService.createNote(this.newNote as Note).subscribe(() => {
      this.loadNotes();
      this.hideCreateNoteContainer();
      this.newNote = { title: '', content: '' };
    });
  }

  editNote(): void {
    if (this.selectedNote && this.selectedNoteId) {
      this.noteService.updateNote(this.selectedNoteId, this.editedNote as Note).subscribe(() => {
        this.loadNotes();
        this.hideEditNoteContainer();
      });
    }
  }

  deleteNote(): void {
    if (this.selectedNote && this.selectedNoteId) {
      this.noteService.deleteNote(this.selectedNoteId).subscribe(() => {
        this.loadNotes();
        this.hideDeleteNoteModal();
      });
    }
  }

  onBack(): void {
    this.showDefaultMessage = true;
    this.showSingleNote = false;
    this.showCreateNote = false;
    this.showEditNote = false;
  }

  onEditClick(event: Event, note: Note): void {
    event.preventDefault();
    this.showEditNoteContainer(note);
  }

  onDeleteClick(event: Event, note: Note): void {
    event.preventDefault();
    this.showDeleteNoteModal(note);
  }
}
