// src/pages/Records/index.tsx

import Layout from '@/components/layout';
import * as React from 'react';
import './index.css'; // Your existing styles
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { makeData } from './makeData'; 
import { Person } from './records.types';
import { staticPersonColumns } from './recordTable.config';
import { useUserAuth } from '../../context/userAuthContext';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';
import { useRecordInfoModal } from '../../hooks/useRecordInfoModal';
import { RecordInfoModal } from '../../components/modals/RecordInfoModal';

interface IRecordsProps {}

const Records: React.FunctionComponent<IRecordsProps> = (props) => {
  const [data, setData] = React.useState(() => makeData(1000) as Person[]);
  const { user } = useUserAuth(); // Get current Firebase user

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
      setData(currentData => currentData.filter(p => p.id !== deletedRecordId));
    }
  });

  // Info Modal Logic
  const {
    isInfoModalOpen,
    selectedRecordForInfo,
    openInfoModal,
    closeInfoModal,
  } = useRecordInfoModal();

  // Edit Click Handler
  const handleEditClick = React.useCallback((personToEdit: Person) => {
    console.log("Edit:", personToEdit);
    // TODO: Implement actual edit logic (e.g., navigate or open a dedicated edit modal)
    // For example, you might set state for an edit modal:
    // setSelectedRecordForEdit(personToEdit);
    // setIsEditModalOpen(true);
    closeInfoModal(); // Close info modal after initiating edit
  }, [closeInfoModal]);

  // --- Permission Check Logic ---
  const [canManageSelectedRecord, setCanManageSelectedRecord] = React.useState(false);

  React.useEffect(() => {
    if (user && selectedRecordForInfo) {
      // Example Permission Logic:
      // 1. User has an 'admin' role (assuming 'role' exists on your user object,
      //    you might need to cast `user` or fetch custom claims)
      // const isAdmin = (user as any).customClaims?.role === 'admin';
      const isAdmin = (user as any).role === 'admin'; // Simpler example, adjust as per your user object

      // 2. Or, user is the owner of the record (assuming 'ownerId' exists on Person type)
      // const isOwner = selectedRecordForInfo.ownerId && user.uid === selectedRecordForInfo.ownerId;
      // For this example, let's just use isAdmin for simplicity.
      // Replace with your actual permission logic.
      // setCanManageSelectedRecord(isAdmin || isOwner);

      // Simplified: For now, let's assume admins can manage.
      // In a real app, 'user.role' might come from custom claims in Firebase.
      // You might need to type your 'user' from useUserAuth more specifically if it includes 'role'.
      if (isAdmin) {
        setCanManageSelectedRecord(true);
      } else {
        // Add more sophisticated checks here, e.g., if record has an ownerId
        // For instance, if `Person` type has `createdByUid?: string`
        // const isOwner = selectedRecordForInfo.createdByUid === user.uid;
        // setCanManageSelectedRecord(isOwner);
        setCanManageSelectedRecord(false); // Default to false if not admin for this example
      }

    } else {
      setCanManageSelectedRecord(false);
    }
  }, [user, selectedRecordForInfo]);


  // Columns definition no longer includes explicit action columns here
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      ...staticPersonColumns,
      // Action columns are removed from here
    ],
    [] // staticPersonColumns is stable, so dependencies can be empty
       // If staticPersonColumns could change, add it here.
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

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">User Records</h1>

        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      scope="col"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => openInfoModal(row.original)}
                    className="odd:bg-white even:bg-gray-50 hover:bg-sky-100 transition-colors duration-150 cursor-pointer"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}
                        className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
           {/* ... pagination buttons (kept same as your last version) ... */}
           <div className="flex items-center gap-2">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-3 py-1.5 text-xs font-medium rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'<< First'}</button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1.5 text-xs font-medium rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'< Previous'}</button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1.5 text-xs font-medium rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'Next >'}</button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-3 py-1.5 text-xs font-medium rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'Last >>'}</button>
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-700">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700 hidden sm:inline">Go to page:</span>
            <input
              type="number"
              min={1}
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                 if (page >=0 && page < table.getPageCount()) {
                    table.setPageIndex(page);
                } else {
                    e.target.value = String(table.getState().pagination.pageIndex + 1);
                }
              }}
              className="w-16 px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => { table.setPageSize(Number(e.target.value)); }}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[10, 20, 30, 40, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}> Show {pageSize} </option>
              ))}
            </select>
          </div>
        </div>
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
        canManage={canManageSelectedRecord}
        onEdit={() => {
          if (selectedRecordForInfo) {
            handleEditClick(selectedRecordForInfo);
            // No need to closeInfoModal here, handleEditClick does it if it opens another modal or navigates
          }
        }}
        onDelete={() => {
          if (selectedRecordForInfo) {
            // Important: Close info modal BEFORE opening delete modal to avoid overlap issues
            closeInfoModal();
            // A slight delay can ensure the info modal is visually gone before delete modal appears
            setTimeout(() => {
                openDeleteModal(selectedRecordForInfo);
            }, 50); // Adjust delay as needed, or remove if not an issue
          }
        }}
      />
    </Layout>
  );
};

export default Records;