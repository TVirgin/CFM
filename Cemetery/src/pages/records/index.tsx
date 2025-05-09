import Layout from '@/components/layout';
import * as React from 'react';
import './index.css';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { makeData } from './makeData';

// --- Import Icons and Firebase specific modules ---
import { Pencil, Trash2 } from 'lucide-react';
import { useUserAuth } from '@/context/userAuthContext'; // Assuming this hook exists
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

type Person = {
  // Assuming your Person type might need an 'id' for actual database operations
  // If makeData doesn't provide one, you might need to adapt.
  // For this example, we'll assume a combination of fields makes a row unique for local filtering.
  id?: string; // Optional ID, highly recommended for DB operations
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

// Keep your existing static column definitions
const staticColumns: ColumnDef<Person>[] = [
    {
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
    ],
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: props => props.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => <span>Visits</span>,
    footer: props => props.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: props => props.column.id,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    footer: props => props.column.id,
  },
];

interface IRecordsProps {}

const Records: React.FunctionComponent<IRecordsProps> = (props) => {
  const [data, setData] = React.useState(() => makeData(1000) as Person[]); // Use setData for local state updates
  const { user } = useUserAuth(); // Get current Firebase user from context

  // --- State for Delete Confirmation Modal ---
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<Person | null>(null);
  const [reauthEmail, setReauthEmail] = React.useState('');
  const [reauthPassword, setReauthPassword] = React.useState('');
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEditClick = (person: Person) => {
    console.log("Edit:", person);
    // In a real app: navigate to an edit page or open an edit modal
    // alert(`Editing ${person.firstName} ${person.lastName}`);
  };

  const handleDeleteAttempt = (person: Person) => {
    setRecordToDelete(person);
    setReauthEmail(user?.email || ''); // Pre-fill email if user is available
    setReauthPassword(''); // Clear password field
    setModalError(null); // Clear previous errors
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
    setModalError(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
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
      // Example: await deleteDoc(doc(db, "yourCollectionName", recordToDelete.id));
      // For now, we'll filter the local state to simulate deletion.
      // This requires a unique identifier on your 'Person' object or a reliable composite key.
      setData(currentData => currentData.filter(p => {
        if (recordToDelete.id) return p.id !== recordToDelete.id; // If you add an ID
        // Fallback to composite key if no ID (less reliable for real data)
        return !(p.firstName === recordToDelete.firstName && p.lastName === recordToDelete.lastName && p.age === recordToDelete.age);
      }));
      console.log("Record deleted (simulated):", recordToDelete);
      // --- END OF SIMULATED DELETION ---

      handleCloseModal();

    } catch (error: any) {
      console.error("Re-authentication or Deletion Failed:", error);
      if (error.code) {
        switch (error.code) {
            case 'auth/wrong-password':
            case 'auth/invalid-credential': // Covers wrong password and sometimes non-existent user for email field if it was changed
                setModalError('Incorrect email or password. Please try again.');
                break;
            case 'auth/user-mismatch':
                setModalError('The credentials provided do not correspond to the current account.');
                break;
            case 'auth/too-many-requests':
                setModalError('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.');
                break;
            default:
                setModalError('An error occurred during re-authentication. Please try again.');
        }
      } else {
        setModalError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Define columns including the new "Actions" column
  // Memoize columns to prevent re-creation on every render, especially important
  // if cell renderers have complex logic or event handlers.
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      ...staticColumns, // Your existing columns
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>, // Align header text
        cell: ({ row }) => (
          <div className="flex items-center justify-end space-x-2"> {/* Aligns buttons to the right */}
            <button
              onClick={() => handleEditClick(row.original)}
              className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-full transition-colors duration-150"
              aria-label={`Edit ${row.original.firstName}`}
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDeleteAttempt(row.original)}
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
    [user] // `user` is a dependency because handleDeleteAttempt uses user.email
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
                    colSpan={columns.length} // Use the length of the defined columns array
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

      {/* Delete Confirmation Modal */}
      {isModalOpen && recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Confirm Deletion
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">
                        Are you sure you want to delete this record?
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                            {recordToDelete.firstName} {recordToDelete.lastName}
                        </p>
                        <p className="text-xs text-red-500 mt-2">
                            This action is irreversible. Please re-authenticate by providing your email and password.
                        </p>
                    </div>
                </div>
            </div>

            {modalError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
                <p className="text-sm text-red-700">{modalError}</p>
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="reauthEmail" className="block text-sm font-medium text-gray-700">
                  Email (Username)
                </label>
                <input
                  type="email"
                  name="reauthEmail"
                  id="reauthEmail"
                  value={reauthEmail}
                  onChange={(e) => setReauthEmail(e.target.value)}
                  disabled={isDeleting}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="reauthPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="reauthPassword"
                  id="reauthPassword"
                  value={reauthPassword}
                  onChange={(e) => setReauthPassword(e.target.value)}
                  disabled={isDeleting}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Record'}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isDeleting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Records;