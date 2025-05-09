import Layout from '@/components/layout';
import * as React from 'react';
import './index.css'; // Contains your base styles
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { makeData } from './makeData'; // Your data generation function

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultColumns: ColumnDef<Person>[] = [
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
  const [data] = React.useState(() => makeData(1000));
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: {
            pageSize: 10,
        }
    }
  });

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">User Records</h1>

        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full"> {/* Removed divide-y, row backgrounds will handle separation */}
            <thead className="bg-gray-100"> {/* Slightly darker header background */}
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-200" // Added thicker bottom border to header
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
            {/* tbody background is not strictly necessary if all rows get a background */}
            {/* Removed divide-y from tbody as row backgrounds will cover it.
                If you want lines between rows, add border-b to the <tr> or <td> elements.
                Often, the alternating colors are enough separation. */}
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    // === ZEBRA STRIPING APPLIED HERE ===
                    className="odd:bg-white even:bg-gray-50 hover:bg-sky-100 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                        // If you want subtle lines between cells (and rows if not using divide-y on tbody):
                        // className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap border-b border-gray-200"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Optional: Footer styling would be similar to thead */}
            {/* <tfoot className="bg-gray-100 border-t-2 border-gray-200"> ... </tfoot> */}
          </table>
        </div>

        {/* Pagination Controls - Styled for better appearance and responsiveness */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 text-xs font-medium  rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<< First'}
            </button>
            <button
              className="px-3 py-1.5 text-xs font-medium  rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'< Previous'}
            </button>
            <button
              className="px-3 py-1.5 text-xs font-medium  rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'Next >'}
            </button>
            <button
              className="px-3 py-1.5 text-xs font-medium  rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'Last >>'}
            </button>
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
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[10, 20, 30, 40, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Records;