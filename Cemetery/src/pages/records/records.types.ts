// src/pages/records/records.types.ts
export type Person = {
    id: string; // Highly recommended for database operations
    firstName: string;
    middleName: string;
    lastName: string;
    birth: Date | null;
    death: Date | null;
    block: string;
    row: number;
    pos: number;
  };


export interface RecordSearchFilters {
  firstName?: string;
  lastName?: string;
  birthDate?: string; // Stored as "YYYY-MM-DD" string from input
  deathDate?: string; // Stored as "YYYY-MM-DD" string from input
}