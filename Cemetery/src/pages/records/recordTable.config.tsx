// src/features/records/recordTable.config.ts
import { ColumnDef } from '@tanstack/react-table';
import { Person } from './records.types'; // Import Person type

export const staticPersonColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: info => info.getValue(),
    footer: props => props.column.id,
  },
  {
    accessorFn: row => row.middleName,
    id: 'middle',
    cell: info => info.getValue(),
    header: () => <span>Middle Name</span>,
    footer: props => props.column.id,
  },
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: props => props.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: props => props.column.id,
  },
  {
    accessorKey: 'DOB',
    header: () => <span>DoB</span>,
    footer: props => props.column.id,
  },
  {
    accessorKey: 'DoD',
    header: 'DoD',
    footer: props => props.column.id,
  },
  {
    accessorKey: 'block',
    header: 'Block',
    footer: props => props.column.id,
  },
];