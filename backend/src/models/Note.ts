class Note {
  id: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(id: string, title: string, content: string, createdAt: Date, UpdatedAt: Date) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = UpdatedAt;
  }
}

export default Note;
