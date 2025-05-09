// src/pages/Records/index.tsx (or wherever your Records.tsx is)
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
import { makeData } from './makeData'; // Assuming this remains or is also in a shared utils

import { Pencil, Trash2 } from 'lucide-react';
import { Person } from '@/pages/records/records.types';
import { staticPersonColumns } from '@/pages/records/recordTable.config'; 
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation'; // Import custom hook
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal'; // Import modal component

interface IRecordsProps {}

const Records: React.FunctionComponent<IRecordsProps> = (props) => {
  const [data, setData] = React.useState(() => makeData(1000) as Person[]);

  const {
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
  } = useDeleteConfirmation({
    onDeleteSuccess: (deletedRecordId) => {
      // Update local state after successful deletion (simulated)
      // For real deletion, this might re-fetch data or optimistically update
      setData(currentData => currentData.filter(p => p.id !== deletedRecordId));
      console.log("Record deleted from local state (ID):", deletedRecordId);
    }
  });

  const handleEditClick = (person: Person) => {
    console.log("Edit:", person);
    // Implement edit logic (e.g., navigate or open edit modal)
  };

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      ...staticPersonColumns,
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => handleEditClick(row.original)}
              className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-full transition-colors duration-150"
              aria-label={`Edit ${row.original.firstName}`}
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => openDeleteModal(row.original)} // Use from hook
              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-150"
              aria-label={`Delete ${row.original.firstName}`}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [openDeleteModal] // Dependency for actions column: openDeleteModal from hook
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
                    className="odd:bg-white even:bg-gray-50 hover:bg-sky-100 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
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

        {/* Pagination Controls (Keep your existing styled pagination) */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'<< First'}</button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'< Previous'}</button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'Next >'}</button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'Last >>'}</button>
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

      {/* Render the separate Modal Component */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        record={recordToDelete}
        email={reauthEmail}
        onEmailChange={setReauthEmail}
        password={reauthPassword}
        onPasswordChange={setReauthPassword}
        error={modalError}
        isDeleting={isDeleting}
      />
    </Layout>
  );
};

export default Records;