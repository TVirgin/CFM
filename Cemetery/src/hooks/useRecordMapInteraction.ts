import * as React from 'react';
import { Person, BlockLayout, PlotIdentifier } from '@/pages/records/records.types'; // Adjust path
import { getBlockLayout } from '@/services/blockLayoutService'; // Adjust path
import { useRecordInfoModal } from './useRecordInfoModal'; // Adjust path

// This hook manages the state and interactions between the map, table, and info modal
export function useRecordMapInteraction(allRecords: Person[]) {
  // Info Modal state (we can move the hook call inside here to couple them)
  const {
    isInfoModalOpen,
    selectedRecordForInfo,
    openInfoModal: baseOpenInfoModal,
    closeInfoModal: baseCloseInfoModal,
  } = useRecordInfoModal();

  // State for the map itself
  const [plotToHighlight, setPlotToHighlight] = React.useState<PlotIdentifier | null>(null);
  const [showMap, setShowMap] = React.useState(true);
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(null);
  const [activeBlockLayout, setActiveBlockLayout] = React.useState<BlockLayout | null | 'not-found'>(null);
  const [isLayoutLoading, setIsLayoutLoading] = React.useState(false);

  // Effect to fetch block layout when a ward/block is selected
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
  
  // --- Interaction Handlers ---
  const openInfoModalAndHighlight = React.useCallback((person: Person) => {
    baseOpenInfoModal(person);
    if (person.block) {
      setActiveBlockId(person.block); // Switch to the correct ward view
      if (typeof person.lot === 'number' && typeof person.pos === 'number') {
        const plotIdentifier: PlotIdentifier = { block: person.block, lot: person.lot, pos: person.pos, rawId: `plot-${person.block}-${person.lot}-${person.pos}` };
        setPlotToHighlight(plotIdentifier);
      }
    } else {
      setPlotToHighlight(null);
    }
  }, [baseOpenInfoModal]);

  const closeInfoModalAndClearHighlight = React.useCallback(() => {
    baseCloseInfoModal();
    setPlotToHighlight(null);
  }, [baseCloseInfoModal]);

  const handleMapPlotClick = React.useCallback((plotIdentifier: PlotIdentifier) => {
    if (activeBlockId) { // In detailed view
      const foundRecord = allRecords.find(p => p.block === plotIdentifier.block && p.lot === plotIdentifier.lot && p.pos === plotIdentifier.pos);
      if (foundRecord) openInfoModalAndHighlight(foundRecord);
      else {
        setPlotToHighlight(plotIdentifier);
        if (isInfoModalOpen) baseCloseInfoModal();
      }
    } else { // In overview map
      const clickedWardId = plotIdentifier.block;
      setActiveBlockId(clickedWardId);
      setPlotToHighlight(null);
    }
  }, [allRecords, activeBlockId, isInfoModalOpen, openInfoModalAndHighlight, baseCloseInfoModal]);

  const handleReturnToOverview = () => {
    setActiveBlockId(null);
    setPlotToHighlight(null);
  };

  return {
    showMap,
    setShowMap,
    activeBlockId,
    activeBlockLayout,
    isLayoutLoading,
    plotToHighlight,
    isInfoModalOpen,
    selectedRecordForInfo,
    handleMapPlotClick,
    openInfoModalAndHighlight,
    closeInfoModalAndClearHighlight,
    handleReturnToOverview,
  };
}