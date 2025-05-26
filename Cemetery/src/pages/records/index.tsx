// src/pages/Records/index.tsx

import Layout from '@/components/layout';
import * as React from 'react';
import './index.css'; // Your existing styles
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Person } from './records.types';
import { staticPersonColumns } from './recordTable.config'; // Ensure .tsx if it has JSX
import { useUserAuth } from '../../context/userAuthContext'; // Adjust path

// Import refactored hooks and components
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation'; // Adjust path
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal'; // Adjust path
import { useRecordInfoModal } from '../../hooks/useRecordInfoModal'; // Adjust path
import { RecordInfoModal } from '../../components/modals/RecordInfoModal'; // Adjust path
import { useRecordsData } from '../../hooks/useRecordsData'; // Adjust path
import { RecordsTableDisplay } from '../../components/records/RecordsTableDisplay'; // Adjust path
import { RecordsPagination } from '../../components/records/RecordsPagination'; // Adjust path
import { useRecordManagementPermission } from '../../hooks/useRecordManagementPermission'; // Adjust path


interface IRecordsProps {}

const Records: React.FunctionComponent<IRecordsProps> = (props) => {
  const { user, loadingAuth } = useUserAuth();

  // Data fetching logic now in custom hook, fetches regardless of user login status (conditionally inside hook)
  const { data, isLoadingRecords, fetchError, refetchRecords } = useRecordsData(user, loadingAuth);

  // Delete Modal Logic
  const {
    isModalOpen: isDeleteModalOpen,
    recordToDelete,
    reauthEmail,
    setReauthEmail,
    reauthPassword,
    setReauthPassword,
    modalError: deleteModalError,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteConfirmation({
    onDeleteSuccess: (deletedRecordId) => {
      refetchRecords(); // Refetch data after successful delete
      console.log("Record deleted, refetching data (ID):", deletedRecordId);
    }
  });

  // Info Modal Logic
  const {
    isInfoModalOpen,
    selectedRecordForInfo,
    openInfoModal,
    closeInfoModal,
  } = useRecordInfoModal();

  // Permission Check Logic
  const canManageSelectedRecord = useRecordManagementPermission(user, selectedRecordForInfo);

  // Edit Click Handler
  const handleEditClick = React.useCallback((personToEdit: Person) => {
    console.log("Edit:", personToEdit);
    // TODO: Implement actual edit logic
    closeInfoModal();
  }, [closeInfoModal]);

  // Columns definition
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      ...staticPersonColumns,
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Handle initial auth loading state
  if (loadingAuth) {
    return (
        <Layout>
            <div className="p-4 sm:p-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-lg text-gray-500">Authenticating...</p>
            </div>
        </Layout>
    );
  }

  // --- Removed the block that showed "Please log in to view records." ---
  // Data fetching and display will now proceed regardless of login status,
  // handled by useRecordsData and RecordsTableDisplay.

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl mx-auto max-w-7xl">
        {/* Title can be dynamic if needed, e.g., based on whether 'user' exists */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          {user ? `${user.displayName || 'User'}'s Records` : "Public Records"}
        </h1>

        {/* RecordsTableDisplay now handles its internal loading/error/no data message */}
        <RecordsTableDisplay
            table={table}
            onRowClick={openInfoModal}
            // Pass true for isLoading if either auth is loading (and no user yet) OR records are loading
            isLoading={isLoadingRecords && data.length === 0}
            hasError={!!fetchError}
        />
        {/* The "No records found" message inside RecordsTableDisplay should be generic enough
            or you can pass a prop to customize it based on user state if needed.
            Alternatively, show specific messages here: */}

        {!isLoadingRecords && fetchError && (
             <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p><strong>Error:</strong> {fetchError}</p>
            </div>
        )}

        {!isLoadingRecords && !fetchError && data.length === 0 && (
             <div className="text-center py-10 text-gray-500">
                {user ? 'No records found for your account.' : 'No public records available at the moment.'}
            </div>
        )}

        {!isLoadingRecords && !fetchError && data.length > 0 && (
            <RecordsPagination table={table} />
        )}
      </div>

      {/* Render Modals */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        record={recordToDelete}
        email={reauthEmail}
        onEmailChange={setReauthEmail}
        password={reauthPassword}
        onPasswordChange={setReauthPassword}
        error={deleteModalError}
        isDeleting={isDeleting}
      />

      <RecordInfoModal
        isOpen={isInfoModalOpen}
        onClose={closeInfoModal}
        record={selectedRecordForInfo}
        canManage={canManageSelectedRecord} // This will be false if no user is logged in
        onEdit={() => {
          if (selectedRecordForInfo) {
            handleEditClick(selectedRecordForInfo);
          }
        }}
        onDelete={() => {
          if (selectedRecordForInfo) {
            closeInfoModal();
            setTimeout(() => {
                openDeleteModal(selectedRecordForInfo);
            }, 50);
          }
        }}
      />
    </Layout>
  );
};

export default Records;