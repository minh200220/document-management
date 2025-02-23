interface Document {
  id: string;
  folderId?: string;
  title: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  snippet?: string;
  timestamp?: number;
}

export default Document;
