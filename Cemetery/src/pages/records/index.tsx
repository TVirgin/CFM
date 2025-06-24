// src/pages/Records/index.tsx

import Layout from '@/components/layout';
import * as React from 'react';
import './index.css';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Person, RecordSearchFilters, BlockLayout } from './records.types';
import { staticPersonColumns } from './recordTable.config';
import { useUserAuth } from '../../context/userAuthContext';
import { getBlockLayout, setBlockLayout } from '../../services/blockLayoutService'; // Import the new service function
import { BlockLayoutFormModal } from '../../components/modals/BlockLayoutFormModal'; // Import new modal

import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';
import { useRecordInfoModal } from '../../hooks/useRecordInfoModal';
import { RecordInfoModal } from '../../components/modals/RecordInfoModal';
import { useRecordsData } from '../../hooks/useRecordsData';
import { RecordsTableDisplay } from '../../components/records/RecordsTableDisplay';
import { RecordsPagination } from '../../components/records/RecordsPagination';
import { useRecordManagementPermission } from '../../hooks/useRecordManagementPermission';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, MapPin, ArrowLeft, Edit } from "lucide-react"; // Added ArrowLeft icon

// --- Map Component Imports ---
import { InteractiveCemeteryMap, PlotIdentifier } from '../../components/maps/InteractiveCemeteryMap'; // Adjust path
import { CemeteryMapSVG } from '../../components/maps/CemeteryMapSVG'; // Your main overview map component
import { GridMapDisplay } from '../../components/maps/GridMapDisplay'; // Your new grid-based map


interface IRecordsProps { }

const Records: React.FunctionComponent<IRecordsProps> = (props) => {
  const { user, loadingAuth } = useUserAuth();
  // const navigate = useNavigate();

  // --- State for Search Filters ---
  const initialSearchFilters: RecordSearchFilters = { firstName: '', lastName: '', birthDate: '', deathDate: '' };
  const [searchFilters, setSearchFilters] = React.useState<RecordSearchFilters>(initialSearchFilters);
  const [activeSearchFilters, setActiveSearchFilters] = React.useState<RecordSearchFilters>(initialSearchFilters);

  // --- Data Fetching & Table State ---
  const { data: allRecords, isLoadingRecords, fetchError, refetchRecords: refetchAllRecords } = useRecordsData(user, loadingAuth);
  const [filteredData, setFilteredData] = React.useState<Person[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // --- State for Map Interaction & Drill-Down ---
  const [plotToHighlight, setPlotToHighlight] = React.useState<PlotIdentifier | null>(null);
  const [showMap, setShowMap] = React.useState(true); // Keep map initially visible
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(null);

  // --- NEW: State for layout fetching and editing ---
  const [activeBlockLayout, setActiveBlockLayout] = React.useState<BlockLayout | null | 'not-found'>(null);
  const [isLayoutLoading, setIsLayoutLoading] = React.useState(false);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = React.useState(false);
  const [isLayoutSaving, setIsLayoutSaving] = React.useState(false);

  React.useEffect(() => {
    if (activeBlockId) {
      setIsLayoutLoading(true);
      getBlockLayout(activeBlockId)
        .then(layout => {
          setActiveBlockLayout(layout || 'not-found'); // Set to 'not-found' if null is returned
        })
        .catch(error => {
          console.error("Failed to load block layout:", error);
          setActiveBlockLayout('not-found'); // Treat error as not found
          // Optionally set an error state to show in the UI
        })
        .finally(() => {
          setIsLayoutLoading(false);
        });
    } else {
      setActiveBlockLayout(null); // Clear layout when returning to overview
    }
  }, [activeBlockId]);

  // --- Client-Side Filtering Logic (UPDATED) ---
  React.useEffect(() => {
    let recordsToFilter = [...allRecords];

    // First, filter by the selected ward/block if one is active
    if (activeBlockId) {
      recordsToFilter = recordsToFilter.filter(person => person.block === activeBlockId);
    }

    if (activeSearchFilters.firstName) { const searchTerm = activeSearchFilters.firstName.toLowerCase(); recordsToFilter = recordsToFilter.filter(p => p.firstName.toLowerCase().includes(searchTerm)); }
    if (activeSearchFilters.lastName) { const searchTerm = activeSearchFilters.lastName.toLowerCase(); recordsToFilter = recordsToFilter.filter(p => p.lastName.toLowerCase().includes(searchTerm)); }
    if (activeSearchFilters.birthDate) { recordsToFilter = recordsToFilter.filter(p => { if (!p.birth) return false; try { return p.birth.toISOString().split('T')[0] === activeSearchFilters.birthDate; } catch (e) { return false; } }); }
    if (activeSearchFilters.deathDate) { recordsToFilter = recordsToFilter.filter(p => { if (!p.death) return false; try { return p.death.toISOString().split('T')[0] === activeSearchFilters.deathDate; } catch (e) { return false; } }); }

    setFilteredData(recordsToFilter);
  }, [allRecords, activeSearchFilters, activeBlockId]);

  // --- Search Handlers ---More actions
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [id]: value }));
  };
  const handleSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setActiveSearchFilters(searchFilters);
  };
  const handleResetSearch = () => {
    setSearchFilters(initialSearchFilters);
    setActiveSearchFilters(initialSearchFilters);
  };

  // --- Delete Modal Logic ---
  const { isModalOpen: isDeleteModalOpen, recordToDelete, reauthEmail, setReauthEmail, reauthPassword, setReauthPassword, modalError: deleteModalError, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete, } = useDeleteConfirmation({ onDeleteSuccess: (deletedRecordId) => { refetchAllRecords(); setPlotToHighlight(null); } });
  // --- Info Modal Logic & Map Highlighting ---
  const { isInfoModalOpen, selectedRecordForInfo, openInfoModal: baseOpenInfoModal, closeInfoModal: baseCloseInfoModal, } = useRecordInfoModal();

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
    // Don't navigate back to overview map automatically, let user do it.
  }, [baseCloseInfoModal]);

  // Permission Check Logic (remains the same)
  const canManageSelectedRecord = useRecordManagementPermission(user, selectedRecordForInfo);

  // Edit Click Handler (remains the same)
  const handleEditClick = React.useCallback((personToEdit: Person) => {
    console.log("Edit:", personToEdit);
    closeInfoModalAndClearHighlight();
  }, [closeInfoModalAndClearHighlight]);

  const openLayoutModal = () => {
    setIsLayoutModalOpen(true);
  };

  const handleLayoutFormSubmit = async (layoutData: { lotCount: number; plotsPerLot: number; }) => {
    if (!activeBlockId)
      return alert("Error: No active block selected.");

    setIsLayoutSaving(true);
    try {
      await setBlockLayout(activeBlockId, layoutData);
      setIsLayoutModalOpen(false);
      // Trigger a re-fetch of the layout data
      const newLayout = await getBlockLayout(activeBlockId);
      setActiveBlockLayout(newLayout || 'not-found');
    } catch (error: any) {
      console.error("Failed to save layout:", error);
      alert(`Error saving layout: ${error.message}`);
    } finally {
      setIsLayoutSaving(false);
    }
  };

  // --- Map Click Handlers (Updated for Drill-Down) ---
  const handleMapPlotClick = React.useCallback((plotIdentifier: PlotIdentifier) => {
    if (activeBlockId) {
      // In a detailed grid view, a plot was clicked
      const foundRecord = allRecords.find(p => p.block === plotIdentifier.block && p.lot === plotIdentifier.lot && p.pos === plotIdentifier.pos);
      if (foundRecord) {
        openInfoModalAndHighlight(foundRecord);
      } else {
        // A truly empty plot was clicked, just highlight it
        setPlotToHighlight(plotIdentifier);
        if (isInfoModalOpen)
           baseCloseInfoModal();
        console.warn(`No record found for plot: ${plotIdentifier.rawId}`);
      }
    } else { // In overview map
      const clickedWardId = plotIdentifier.block;
      setActiveBlockId(clickedWardId);
      setPlotToHighlight(null);
    }
  }, [allRecords, activeBlockId, openInfoModalAndHighlight, baseCloseInfoModal, isInfoModalOpen]);

  const handleReturnToOverview = () => {
    setActiveBlockId(null);
    setPlotToHighlight(null);
  };

  // --- Table Setup (remains the same) ---
  const columns = React.useMemo<ColumnDef<Person>[]>(() => [...staticPersonColumns], []);
  const table = useReactTable({ data: filteredData, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), initialState: { pagination: { pageSize: 10 } }, });
  // const SelectedWardComponent = activeBlockId ? wardComponentMap[activeBlockId] : null;

  if (loadingAuth) {
    return (
      <Layout>
        <div className="p-4 sm:p-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
          <p className="text-lg text-gray-500">Authenticating...</p>
        </div>
      </Layout>
    );
  }

  // const SelectedWardComponent = activeBlockId ? wardComponentMap[activeBlockId] : null;

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl mx-auto max-w-full xl:max-w-screen-2xl">
        {/* --- Search UI & Map Toggle --- */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
              {user ? `${user.displayName || 'User'}'s Records` : "Public Records"}
            </h1>
            <Button variant="outline" onClick={() => setShowMap(!showMap)} className="flex items-center w-full sm:w-auto">
              <MapPin size={18} className="mr-2" /> {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* First Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Search first name..." value={searchFilters.firstName} onChange={handleSearchInputChange} />
            </div>
            {/* Last Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Search last name..." value={searchFilters.lastName} onChange={handleSearchInputChange} />
            </div>
            {/* Birth Date */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" type="date" value={searchFilters.birthDate} onChange={handleSearchInputChange} />
            </div>
            {/* Death Date */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="deathDate">Death Date</Label>
              <Input id="deathDate" type="date" value={searchFilters.deathDate} onChange={handleSearchInputChange} />
            </div>
            <div className="flex space-x-2 sm:col-span-2 md:col-span-2 lg:col-span-4 lg:justify-start mt-4 lg:mt-0">
              <Button type="submit" className="flex items-center"><Search size={18} className="mr-2" /> Search</Button>
              <Button type="button" variant="outline" onClick={handleResetSearch} className="flex items-center"><RotateCcw size={18} className="mr-2" /> Reset</Button>
            </div>
          </form>
        </div>

        {/* --- Main Content Area: Map and Table Side-by-Side --- */}
        <div className="flex flex-col lg:flex-row lg:space-x-6">

          {/* --- Column 1: Map (Conditionally Rendered) --- */}
          {/* --- Map Section with Conditional Rendering for Drill-Down --- */}
          {showMap && (
            <div className="mb-6 p-1 sm:p-2 border rounded-md bg-gray-50 shadow">
              <div className="flex justify-between items-center px-2 pt-1 mb-2">
                <h3 className="text-lg font-medium text-gray-800">
                  {activeBlockId ? `Block ${activeBlockId} Details` : "Cemetery Overview"}
                </h3>
                <div>
                  {/* --- Conditionally show Edit Layout button --- */}
                  {activeBlockId && activeBlockLayout && activeBlockLayout !== 'not-found' && user && ( //&& role === 'admin' && (
                    <Button variant="outline" size="sm" onClick={openLayoutModal} className="flex items-center text-sm mr-2">
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
                // --- Logic for Detailed View ---
                isLayoutLoading ? (
                  <div className="text-center py-20">Loading Block Layout...</div>
                ) : activeBlockLayout === 'not-found' ? (
                  <div className="text-center py-20 text-gray-600">
                    <p>Layout for Ward '{activeBlockId}' is not defined.</p>
                    {user && ( //role === 'admin' && ( // Only admins can create layouts
                      <Button onClick={openLayoutModal} className="mt-4">Create Layout</Button>
                    )}
                  </div>
                ) : activeBlockLayout ? (
                  <GridMapDisplay
                    layout={activeBlockLayout}
                    occupiedRecords={filteredData}
                    selectedPlot={plotToHighlight}
                    onPlotClick={handleMapPlotClick}
                  />
                ) : null
              ) : (
                // --- RENDER OVERVIEW SVG MAP ---
                <InteractiveCemeteryMap
                  SvgMapOverlayComponent={
                    CemeteryMapSVG as React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { ref?: React.Ref<SVGSVGElement> }>
                  }
                  selectedPlotId={null} // Highlighting on overview is not for individual plots
                  onPlotClick={handleMapPlotClick} // Clicks will switch to detailed view
                />
              )}
            </div>
          )}

          {/* --- Column 2: Table and Pagination --- */}
          <div className="flex-1 min-w-0"> {/* flex-1 takes remaining space, min-w-0 prevents table overflow issues */}
            {isLoadingRecords ? (
              <div className="text-center py-10 text-gray-500">Loading records...</div>
            ) : fetchError ? (
              <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p><strong>Error:</strong> {fetchError}</p>
              </div>
            ) : (
              <>
                <RecordsTableDisplay
                  table={table}
                  onRowClick={openInfoModalAndHighlight} // Use new handler for lot clicks
                  isLoading={false} // isLoadingRecords already handled above
                  hasError={false}  // fetchError already handled above
                />
                {filteredData.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    No records found matching your criteria.
                  </div>
                )}
                {filteredData.length > 0 && (
                  <RecordsPagination table={table} />
                )}
              </>
            )}
          </div>

        </div> {/* End of side-by-side container */}
      </div>

      {/* Render Modals */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete}
        record={recordToDelete} email={reauthEmail} onEmailChange={setReauthEmail}
        password={reauthPassword} onPasswordChange={setReauthPassword}
        error={deleteModalError} isDeleting={isDeleting}
      />
      <RecordInfoModal
        isOpen={isInfoModalOpen}
        onClose={closeInfoModalAndClearHighlight} // Use new handler for modal close
        record={selectedRecordForInfo}
        canManage={canManageSelectedRecord}
        onEdit={() => { if (selectedRecordForInfo) handleEditClick(selectedRecordForInfo); }}
        onDelete={() => {
          if (selectedRecordForInfo) {
            closeInfoModalAndClearHighlight(); // Close info & clear highlight
            setTimeout(() => {
              openDeleteModal(selectedRecordForInfo);
            }, 50); // Delay to allow info modal to close visually
          }
        }}
      />

      {/* --- RENDER NEW MODAL --- */}
      <BlockLayoutFormModal
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
        onSubmit={handleLayoutFormSubmit}
        isSaving={isLayoutSaving}
        blockId={activeBlockId} // blockId is guaranteed to be non-null here
        initialData={activeBlockLayout !== 'not-found' ? activeBlockLayout : null}
      />
    </Layout>
  );
};

export default Records;