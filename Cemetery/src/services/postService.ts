import { db } from '../firebaseConfig'; // Adjust path as needed
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp, // Import if you are converting Timestamps to Dates
  addDoc,    // For creating posts
  updateDoc, // For updating posts
  doc,       // For specific document references
  serverTimestamp // For server-side timestamps on create/update
} from 'firebase/firestore';
import { Post, PostFormData } from '../pages/home/post.types';
// Assuming your Post type in post.types.ts might have createdAt/updatedAt as Date | null
// and your Firestore documents store them as Timestamps.

const POSTS_COLLECTION = 'posts';

// READ: Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    // Order by creation time, newest first
    const q = query(postsCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // Convert Firestore Timestamps to JS Date objects if necessary
        // This depends on how your Post type defines these fields
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Post; // Ensure this mapping matches your Post type
    });
  } catch (error) {
    console.error("Error getting all posts: ", error);
    throw error;
  }
};

// CREATE: Add a new post
export const createPost = async (postData: PostFormData, userId: string, authorName: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      authorId: userId,
      authorName: authorName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
};

// UPDATE: Update an existing post
export const updatePost = async (postId: string, postData: PostFormData): Promise<void> => {
  try {
    const postDocRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postDocRef, {
      ...postData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating post: ", error);
    throw error;
  }
};

// You would also add a deletePost function here if needed