export type Person = {
    id: string; 
    firstName: string;
    middleName: string;
    lastName: string;
    birth: string;
    death: string;
    block: string;
    lot: number;
    pos: number;
    plot: number;
  };


export interface RecordSearchFilters {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  deathDate?: string;
}

export interface BlockLayout {
  id: string;
  lotCount: number;
  positionsPerLot: number;
  plotsPerPosition: number; 
  lotColumns?: number; // NEW: Number of columns for lots (e.g., 1 or 2)
}

export interface PlotIdentifier {
  block: string;    
  lot: number;      
  pos: number;      
  plot: number;    
  rawId: string; 
}