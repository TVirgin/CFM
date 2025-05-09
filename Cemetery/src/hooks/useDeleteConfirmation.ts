// src/hooks/useDeleteConfirmation.ts
import * as React from 'react';
import { useUserAuth } from '@/context/userAuthContext';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Person } from '@/pages/records/records.types'; // Adjust path as needed

interface UseDeleteConfirmationOptions {
  onDeleteSuccess?: (deletedRecordId: string | undefined) => void; // Callback with ID of deleted record
  // You might want to pass the actual Firebase delete function if it varies
  // performFirebaseDelete: (recordId: string) => Promise<void>;
}

export function useDeleteConfirmation({ onDeleteSuccess }: UseDeleteConfirmationOptions) {
  const { user } = useUserAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<Person | null>(null);
  const [reauthEmail, setReauthEmail] = React.useState('');
  const [reauthPassword, setReauthPassword] = React.useState('');
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openDeleteModal = (record: Person) => {
    setRecordToDelete(record);
    setReauthEmail(user?.email || '');
    setReauthPassword('');
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setRecordToDelete(null); // Clear record on close
    setModalError(null);
    setIsDeleting(false);
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !user) {
      setModalError("Cannot proceed: User or record information is missing.");
      return;
    }
    if (!reauthEmail.trim() || !reauthPassword.trim()) {
      setModalError("Email and password are required for re-authentication.");
      return;
    }

    setIsDeleting(true);
    setModalError(null);

    try {
      const credential = EmailAuthProvider.credential(reauthEmail, reauthPassword);
      await reauthenticateWithCredential(user, credential);
      console.log("User re-authenticated successfully.");

      // --- !!! REPLACE THIS WITH ACTUAL FIREBASE DELETION LOGIC !!! ---
      // Example: await deleteDoc(doc(db, "yourCollectionName", recordToDelete.id!)); // Use recordToDelete.id
      console.log("Record deletion initiated (simulated) for ID:", recordToDelete.id);
      // --- END OF SIMULATED DELETION ---

      if (onDeleteSuccess) {
        onDeleteSuccess(recordToDelete.id); // Pass back the ID (or the whole record)
      }
      closeDeleteModal();

    } catch (error: any) {
      console.error("Re-authentication or Deletion Failed:", error);
      let message = 'An unexpected error occurred. Please try again.';
      if (error.code) {
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = 'Incorrect email or password. Please try again.';
            break;
          case 'auth/user-mismatch':
            message = 'The credentials provided do not correspond to the current account.';
            break;
          case 'auth/too-many-requests':
            message = 'Access to this account has been temporarily disabled. Please try again later.';
            break;
          default:
            message = 'An error occurred during re-authentication.';
        }
      }
      setModalError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isModalOpen,
    recordToDelete,
    reauthEmail,
    setReauthEmail,
    reauthPassword,
    setReauthPassword,
    modalError,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
}