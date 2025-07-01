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
  blockName: string;
  lotCount: number;
  plotsPerLot: number;
}

export interface PlotIdentifier {
  block: string;
  lot?: number;
  pos?: number;
  plot?: number;
  rawId: string;
}