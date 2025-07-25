import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XCircle, Save } from 'lucide-react';
import { BlockLayout } from '@/pages/records/records.types'; // Adjust path

interface BlockLayoutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (layoutData: { lotCount: number; positionsPerLot: number; plotsPerPosition: number; lotColumns: number; }) => void;
  isSaving: boolean;
  blockId: string | null; // The ID of the block being edited/created (e.g., "A", "1E")
  initialData?: Omit<BlockLayout, 'id' | 'blockName'> | null; // For pre-filling the form on edit
}

export const BlockLayoutFormModal: React.FC<BlockLayoutFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  blockId,
  initialData
}) => {
  const [lotCount, setLotCount] = React.useState(0);
  const [positionsPerLot, setPositionsPerLot] = React.useState(0);
  const [plotsPerPosition, setPlotsPerPosition] = React.useState(0);
  const [lotColumns, setLotColumns] = React.useState(0);

  React.useEffect(() => {
    // Populate form when initialData is provided (for editing)
    if (initialData) {
      setLotCount(initialData.lotCount || 0);
      setPositionsPerLot(initialData.positionsPerLot || 0);
      setPlotsPerPosition(initialData.plotsPerPosition || 0);
      setLotColumns(initialData.lotColumns || 0);

    } else {
      // Reset for creating a new layout
      setLotCount(0);
      setPositionsPerLot(0);
      setPlotsPerPosition(0);
      setLotColumns(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = Number(lotCount);
    const positions = Number(positionsPerLot);
    const plots = Number(plotsPerPosition);
    const lotCol = Number(lotColumns);

    if (lots > 0 && positions > 0 && plots > 0 && lotCol > 0) {
      onSubmit({ lotCount: lots, positionsPerLot: positions, plotsPerPosition: plots, lotColumns: lotCol });
    } else {
      alert("Please enter valid numbers greater than zero for lots and positions.");
    }
  };

  if (!isOpen || !blockId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} disabled={isSaving} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600" aria-label="Close modal">
          <XCircle size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {initialData ? `Edit Layout for Ward ${blockId}` : `Create Layout for Ward ${blockId}`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lotCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Lots</Label>
            <Input
              id="lotCount"
              type="number"
              min="1"
              value={lotCount}
              onChange={(e) => setLotCount(Number(e.target.value))}
              disabled={isSaving}
              required
            />
          </div>
          <div>
            <Label htmlFor="positionsPerLot" className="block text-sm font-medium text-gray-700 mb-1">Posistion per Lot</Label>
            <Input
              id="positionsPerLot"
              type="number"
              min="1"
              value={positionsPerLot}
              onChange={(e) => setPositionsPerLot(Number(e.target.value))}
              disabled={isSaving}
              required
            />
          </div>
          <div>
            <Label htmlFor="positionsPerLot" className="block text-sm font-medium text-gray-700 mb-1">Plots per position</Label>
            <Input
              id="plotsPerPosition"
              type="number"
              min="1"
              value={plotsPerPosition}
              onChange={(e) => setPlotsPerPosition(Number(e.target.value))}
              disabled={isSaving}
              required
            />
          </div>
          <div>
            <Label htmlFor="lotColumns" className="block text-sm font-medium text-gray-700 mb-1">Lot Column Nums</Label>
            <Input
              id="lotColumns"
              type="number"
              min="1"
              value={lotColumns}
              onChange={(e) => setLotColumns(Number(e.target.value))}
              disabled={isSaving}
              required
            />
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="flex items-center">
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Layout'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};