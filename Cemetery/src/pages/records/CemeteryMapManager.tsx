import * as React from 'react';
import { Person, PlotIdentifier, BlockLayout } from './records.types';
import { User } from 'firebase/auth'; // Assuming User type from firebase
import { getBlockLayout, setBlockLayout } from '@/services/blockLayoutService';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

import { InteractiveCemeteryMap } from '../../components/maps/InteractiveCemeteryMap';
import { CemeteryMapSVG } from '../../components/maps/CemeteryMapSVG'; // Your main overview map component
import { GridMapDisplay } from '../../components/maps/GridMapDisplay'; // Your new grid-based map
import { BlockLayoutFormModal } from '../../components/modals/BlockLayoutFormModal'; // Import new modal

interface CemeteryMapManagerProps {
  user: User | null;
  activeBlockId: string | null;
  plotToHighlight: PlotIdentifier | null;
  recordsForBlock: Person[];
  onBlockChange: (blockId: string | null) => void;
  onPlotClick: (plotIdentifier: PlotIdentifier) => void;
}

export const CemeteryMapManager: React.FC<CemeteryMapManagerProps> = ({
  user,
  activeBlockId,
  plotToHighlight,
  recordsForBlock,
  onBlockChange,
  onPlotClick
}) => {
  const [activeBlockLayout, setActiveBlockLayout] = React.useState<BlockLayout | null | 'not-found'>(null);
  const [isLayoutLoading, setIsLayoutLoading] = React.useState(false);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = React.useState(false);
  const [isLayoutSaving, setIsLayoutSaving] = React.useState(false);

  React.useEffect(() => {
    if (activeBlockId) {
      setIsLayoutLoading(true);
      getBlockLayout(activeBlockId)
        .then(layout => setActiveBlockLayout(layout || 'not-found'))
        .catch(error => {
          console.error("Failed to load block layout:", error);
          setActiveBlockLayout('not-found');
        })
        .finally(() => setIsLayoutLoading(false));
    } else {
      setActiveBlockLayout(null);
    }
  }, [activeBlockId]);

  const handleMapPlotClick = (plotIdentifier: PlotIdentifier) => {
    // If we are in the overview map, a click means we should change the block
    if (!activeBlockId) {
      onBlockChange(plotIdentifier.block);
    } else {
    // Otherwise, a click is on a specific plot in the grid
      onPlotClick(plotIdentifier);
    }
  };
  
  const handleReturnToOverview = () => {
    onBlockChange(null);
  };

  const handleLayoutFormSubmit = async (layoutData: { lotCount: number; plotsPerLot: number; }) => {
    if (!activeBlockId) return;
    setIsLayoutSaving(true);
    try {
      await setBlockLayout(activeBlockId, layoutData);
      setIsLayoutModalOpen(false);
      const newLayout = await getBlockLayout(activeBlockId);
      setActiveBlockLayout(newLayout || 'not-found');
    } catch (error: any) {
      alert(`Error saving layout: ${error.message}`);
    } finally {
      setIsLayoutSaving(false);
    }
  };

  return (
    <div className="mb-6 p-1 sm:p-2 border rounded-md bg-gray-50 shadow">
      <div className="flex justify-between items-center px-2 pt-1 mb-2">
        <h3 className="text-lg font-medium text-gray-800">
          {activeBlockId ? `Block ${activeBlockId} Details` : "Cemetery Overview"}
        </h3>
        <div>
          {activeBlockId && activeBlockLayout && activeBlockLayout !== 'not-found' && user && (
            <Button variant="outline" size="sm" onClick={() => setIsLayoutModalOpen(true)} className="flex items-center text-sm mr-2">
              <Edit size={16} className="mr-1" /> Edit Layout
            </Button>
          )}
          {activeBlockId && (
            <Button variant="ghost" size="sm" onClick={handleReturnToOverview} className="flex items-center text-sm">
              <ArrowLeft size={16} className="mr-1" /> Back to Main Map
            </Button>
          )}
        </div>
      </div>

      {activeBlockId ? (
        // --- Detailed Grid View ---
        isLayoutLoading ? (
          <div className="text-center py-20">Loading Block Layout...</div>
        ) : activeBlockLayout === 'not-found' ? (
          <div className="text-center py-20 text-gray-600">
            <p>Layout for Block '{activeBlockId}' is not defined.</p>
            {user && (
              <Button onClick={() => setIsLayoutModalOpen(true)} className="mt-4">Create Layout</Button>
            )}
          </div>
        ) : activeBlockLayout ? (
          <GridMapDisplay
            layout={activeBlockLayout}
            occupiedRecords={recordsForBlock}
            selectedPlot={plotToHighlight}
            onPlotClick={handleMapPlotClick}
          />
        ) : null
      ) : (
        // --- Overview SVG Map ---
        <InteractiveCemeteryMap
          SvgMapOverlayComponent={CemeteryMapSVG as any} // The cast might be needed depending on forwardRef usage
          selectedPlotId={null}
          onPlotClick={handleMapPlotClick}
        />
      )}

      <BlockLayoutFormModal
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
        onSubmit={handleLayoutFormSubmit}
        isSaving={isLayoutSaving}
        blockId={activeBlockId}
        initialData={activeBlockLayout !== 'not-found' ? activeBlockLayout : null}
      />
    </div>
  );
};