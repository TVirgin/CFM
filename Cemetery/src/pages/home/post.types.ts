// src/types/index.ts (or src/types/post.types.ts)
export interface User { // Basic user type, align with your useUserAuth
    uid: string;
    email?: string | null;
    displayName?: string | null;
    role?: 'admin' | 'user'; // Example role for permissions
  }
  
  export interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    authorId: string;
    authorName: string; // Optional: Denormalized for display
    createdAt: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }
  
  // For form data, all fields might be optional initially or during edit
  export type PostFormData = Partial<Omit<Post, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>> & {
      title: string; // Title and content usually required
      content: string;
      imageUrl?: string;
  };