// src/features/records/recordTable.config.ts
import { ColumnDef } from '@tanstack/react-table';
import { Person } from './records.types'; // Import your new Person type

export const staticPersonColumns: ColumnDef<Person>[] = [
  // Column for First Name
  {
    accessorKey: 'firstName', // Accesses the `firstName` property from your Person object
    header: 'First Name',     // Text displayed in the table header for this column
    cell: info => info.getValue(), // Gets the value from accessorKey and renders it. For a string, this is perfect.
    footer: props => props.column.id, // Optional: Displays the column's ID in the footer
  },
  // Column for Middle Name
  {
    // accessorFn is used when you need to compute a value or access a nested property
    // For a direct property like middleName, accessorKey: 'middleName' is often simpler
    accessorFn: row => row.middleName,
    id: 'middleName', // Explicit ID for the column (good practice with accessorFn)
                      // Could also be 'middleName' to match the property
    cell: info => info.getValue(), // Renders the value returned by accessorFn
    header: () => <span>Middle Name</span>, // Header can be a string or a function returning JSX/string
    footer: props => props.column.id,
  },
  // Column for Last Name
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: props => props.column.id,
  },
  // Column for Birth information
  {
    accessorKey: 'birth',
    header: 'Birth Date',
    cell: info => {
      const dateValue = info.getValue() as Date | null;
      if (!dateValue) return 'N/A';
      return dateValue.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  },
  // Column for Death information
  {
    accessorKey: 'death', // UPDATE: Was 'Death', changed to 'death' (lowercase) to match Person type
    header: 'Death Date', // Changed header to be more generic
    cell: info => {
      const dateValue = info.getValue() as Date | null;
      if (!dateValue) return 'N/A';
      return dateValue.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  },
  // Column for Block
  {
    accessorKey: 'block',
    header: 'Block',
    cell: info => info.getValue(), // Good for displaying the string directly
    footer: props => props.column.id,
  },
  // Column for Row
  {
    accessorKey: 'row',
    header: 'Row',
    cell: info => info.getValue(), // Good for displaying the number directly
    footer: props => props.column.id,
  },
  // Column for Position
  {
    accessorKey: 'pos',
    header: 'Position',
    cell: info => info.getValue(), // Good for displaying the number directly
    footer: props => props.column.id,
  },
];