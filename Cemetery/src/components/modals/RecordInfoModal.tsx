// src/components/modals/RecordInfoModal.tsx
import * as React from 'react';
import { Person } from '@/pages/records/records.types'; // Adjust path
import { XCircle, Info, Pencil, Trash2 } from 'lucide-react'; // Added Pencil and Trash2

interface RecordInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Person | null;
  onEdit?: () => void; // Optional: only if canManage is true
  onDelete?: () => void; // Optional: only if canManage is true
  canManage: boolean; // New prop to control button visibility
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

  const getStatusClass = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('active') || lowerStatus.includes('completed')) {
      return 'bg-green-100 text-green-800';
    }
    if (lowerStatus.includes('pending') || lowerStatus.includes('relationship')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (lowerStatus.includes('inactive') || lowerStatus.includes('complicated')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out"
      aria-labelledby="info-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className='flex items-center'>
            <Info className="h-6 w-6 text-blue-600 mr-3" aria-hidden="true" />
            <h3 className="text-xl leading-6 font-medium text-gray-900" id="info-modal-title">
              Record Details
            </h3>
          </div>
          {/* <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <XCircle size={28}/>
          </button> */}
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <div><strong>ID:</strong> {record.id || 'N/A'}</div>
          <div><strong>First Name:</strong> {record.firstName}</div>
          <div><strong>Last Name:</strong> {record.lastName}</div>
          <div><strong>Age:</strong> {record.age}</div>
          <div><strong>Visits:</strong> {record.visits}</div>
          <div>
            <strong>Status:</strong>{' '}
            <span
              className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(record.status)}`}
            >
              {record.status}
            </span>
          </div>
          <div className="sm:col-span-2">
            <strong>Profile Progress:</strong>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${record.progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{record.progress}%</span>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-end items-center border-t pt-4 gap-3">
          {/* Conditionally render Edit and Delete buttons */}
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
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto mt-3 sm:mt-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};