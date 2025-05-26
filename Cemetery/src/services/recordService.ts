// src/services/recordService.ts
import { db } from '../firebaseConfig'; // Adjust path as needed
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp, // For server-side timestamps
  query, // For querying
  where, // For where clauses
  orderBy, // For ordering
  Timestamp 
} from 'firebase/firestore';
import { Person } from '../pages/records/records.types.ts'; // Adjust path as needed

const PERSON_COLLECTION = 'personRecords'; // Define your collection name

// CREATE: Add a new record
export const addRecord = async (recordData: Omit<Person, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PERSON_COLLECTION), {
      ...recordData,
      createdAt: serverTimestamp(), // Let Firestore set the timestamp
    });
    return docRef.id; // Return the ID of the newly created document
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getRecords = async (): Promise<Person[]> => {
  try {
    const personCollectionRef = collection(db, PERSON_COLLECTION);
    // Example: Assuming you might want to order by a field, e.g., lastName
    // If you had a 'createdAt' field on Person and an index for it:
    // const q = query(personCollectionRef, orderBy("createdAt", "desc"));
    const q = query(personCollectionRef, orderBy("lastName", "asc")); // Example ordering
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        // --- Convert Timestamp to Date ---
        birth: data.birth instanceof Timestamp ? data.birth.toDate() : null,
        death: data.death instanceof Timestamp ? data.death.toDate() : null,
        // --- End Conversion ---
        block: data.block,
        row: data.row,
        pos: data.pos,
        userId: data.userId, // If you added userId to your Person type
      } as Person; // Cast to Person, ensure all fields align with your Person type
    });
  } catch (error) {
    console.error("Error getting all documents: ", error);
    throw error;
  }
};

// READ: Get records for a specific user
export const getRecord = async (userId: string): Promise<Person[]> => {
  try {
    const personCollectionRef = collection(db, PERSON_COLLECTION);
    const q = query(personCollectionRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Person));
  } catch (error) {
    console.error("Error getting Persons: ", error);
    throw error;
  }
};


// READ: Get a single record by ID
export const getRecordById = async (recordId: string): Promise<Person | null> => {
  try {
    const recordDocRef = doc(db, PERSON_COLLECTION, recordId);
    const docSnap = await getDoc(recordDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Person;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document by ID: ", error);
    throw error;
  }
};

// UPDATE: Update an existing record
export const updateRecord = async (recordId: string, updates: Partial<Person>): Promise<void> => {
  try {
    const recordDocRef = doc(db, PERSON_COLLECTION, recordId);
    await updateDoc(recordDocRef, updates);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// DELETE: Delete a record
export const deleteRecord = async (recordId: string): Promise<void> => {
  try {
    const recordDocRef = doc(db, PERSON_COLLECTION, recordId);
    await deleteDoc(recordDocRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};