// Fix: Replaced incorrect component code with proper type definitions.
export interface SavedEdit {
  id: string;
  original: string; // data URL
  edited: string; // data URL
  prompt: string;
  userId?: string;
  userName?: string;
  userProfilePicture?: string | null;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface PublicPost {
  id: string;
  original: string;
  edited: string;
  prompt: string;
  userId: string;
  userName: string;
  userProfilePicture: string | null;
  likes: number;
  likedBy: string[]; // array of user IDs
  comments: Comment[];
  shares: number;
}
