// src/pages/records/records.types.ts
export type Person = {
    id: string; // Highly recommended for database operations
    firstName: string;
    middleName: string;
    lastName: string;
    birth: Date | null;
    death: Date | null;
    block: string;
    lot: number;
    pos: number;
  };


export interface RecordSearchFilters {
  firstName?: string;
  lastName?: string;
  birthDate?: string; // Stored as "YYYY-MM-DD" string from input
  deathDate?: string; // Stored as "YYYY-MM-DD" string from input
}

// src/pages/records/records.types.ts
export interface BlockLayout {
  id: string;
  blockName: string;
  lotCount: number;
  plotsPerLot: number;
}