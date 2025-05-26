// src/components/modals/RecordInfoModal.tsx
import * as React from 'react';
import { Person } from '@/pages/records/records.types'; // Adjust path
import { XCircle, Info, Pencil, Trash2 } from 'lucide-react';

interface RecordInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Person | null;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage: boolean;
}

export const RecordInfoModal: React.FC<RecordInfoModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
  onDelete,
  canManage,
}) => {
  if (!isOpen || !record) {
    return null;
  }

  // Helper to format birth/death numbers.
  // Assumes if the number is > 100000 (a low timestamp), it's a timestamp. Otherwise, it's a year.
  // Adjust this logic based on how you store these 'number' values.
  // UPDATED Helper to format Date objects
  const formatDateDisplay = (dateValue: Date | null | undefined): string => {
    if (!dateValue) { // Handles null or undefined
      return 'N/A';
    }
    // Ensure it's a valid Date object
    if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
      return 'Invalid Date';
    }
    try {
      // Format the Date object into a readable string
      return dateValue.toLocaleDateString(undefined, { // Uses browser's locale
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      // Fallback for an unexpected error during formatting
      return dateValue.toISOString(); // Or some other simple string representation
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out"
      aria-labelledby="info-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // Click on backdrop closes the modal
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal content
      >
        <div className="flex items-center justify-between mb-6 pb-3 border-b"> {/* Added padding and border to header */}
          <div className='flex items-center'>
            <Info className="h-6 w-6 text-blue-600 mr-3" aria-hidden="true" />
            <h3 className="text-xl leading-6 font-medium text-gray-900" id="info-modal-title">
              Record Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <XCircle size={28}/>
          </button>
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          {/* <div><strong>ID:</strong> <span className="text-gray-900">{record.id || 'N/A'}</span></div> */}
          <div><strong>First Name:</strong> <span className="text-gray-900">{record.firstName}</span></div>
          {record.middleName && <div><strong>Middle Name:</strong> <span className="text-gray-900">{record.middleName}</span></div>}
          <div><strong>Last Name:</strong> <span className="text-gray-900">{record.lastName}</span></div>
          <div><strong>Birth Info:</strong> <span className="text-gray-900">{formatDateDisplay(record.birth)}</span></div>
          <div><strong>Death Info:</strong> <span className="text-gray-900">{formatDateDisplay(record.death)}</span></div>
          <div><strong>Block:</strong> <span className="text-gray-900">{record.block}</span></div>
          <div><strong>Row:</strong> <span className="text-gray-900">{record.row}</span></div>
          <div><strong>Position:</strong> <span className="text-gray-900">{record.pos}</span></div>
          {/* Removed: Age, Visits, Status, Profile Progress */}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-end items-center border-t pt-6 gap-3"> {/* Increased top padding for footer */}
          {canManage && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-sky-700 bg-sky-100 border border-transparent rounded-md shadow-sm hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              <Pencil size={16} className="mr-2" /> Edit
            </button>
          )}
          {canManage && onDelete && (
             <button
              type="button"
              onClick={onDelete}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-md shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};