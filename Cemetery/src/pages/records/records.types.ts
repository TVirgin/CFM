// src/pages/records/records.types.ts
export type Person = {
    id: string; // Highly recommended for database operations
    firstName: string;
    middleName: string;
    lastName: string;
    birth: number;
    death: number;
    block: string;
    row: number;
    pos: number;
  };