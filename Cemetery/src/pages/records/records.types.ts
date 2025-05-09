// src/pages/records/records.types.ts
export type Person = {
    id: string; // Highly recommended for database operations
    firstName: string;
    middleName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
  };