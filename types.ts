
export interface ImageFile {
  file: File;
  previewUrl: string;
}

export interface SavedEdit {
  id: string; // ISO date string, serves as unique ID and timestamp
  original: string;
  edited: string;
  prompt: string;
}