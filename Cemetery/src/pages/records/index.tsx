// src/pages/Records/index.tsx

import Layout from '@/components/layout';
import * as React from 'react';
import './index.css'; // Your existing styles
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Person, RecordSearchFilters } from './records.types';
import { staticPersonColumns } from './recordTable.config';
import { useUserAuth } from '../../context/userAuthContext';

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
import { Search, RotateCcw, MapPin, ArrowLeft } from "lucide-react"; // Added ArrowLeft icon

// --- Map Component Imports ---
import { InteractiveCemeteryMap, PlotIdentifier } from '../../components/maps/InteractiveCemeteryMap'; // Adjust path
import { CemeteryMapSVG } from '../../components/maps/CemeteryMapSVG'; // Your main overview map component

// --- DETAILED WARD SVG COMPONENTS (Examples - you must create these) ---
import { Ward1ESVG } from '../../components/maps/wards/Ward1ESVG'; // Example
import { WardASVG } from '../../components/maps/wards/WardASVG';   // Example
// ... import all other ward SVG components ...


// A helper map to dynamically select the correct ward SVG component
const wardComponentMap: { [key: string]: React.ElementType } = {
  '1E': Ward1ESVG,
  'A': WardASVG,
  // Add entries for all your ward IDs: '1', '2', 'B', 'C', etc.
  // '1': Ward1SVG,
  // '2': Ward2SVG,
};


interface IRecordsProps {}

const Records: React.FunctionComponent<IRecordsProps> = (props) => {
  const { user, loadingAuth } = useUserAuth();

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
  const [activeWardId, setActiveWardId] = React.useState<string | null>(null); // NEW: Tracks which detailed ward map to show


  // Client-Side Filtering Logic (remains the same)
  React.useEffect(() => { /* ... your existing filtering logic ... */
    let recordsToFilter = [...allRecords];
    if (activeSearchFilters.firstName) { const searchTerm = activeSearchFilters.firstName.toLowerCase(); recordsToFilter = recordsToFilter.filter(p => p.firstName.toLowerCase().includes(searchTerm)); }
    if (activeSearchFilters.lastName) { const searchTerm = activeSearchFilters.lastName.toLowerCase(); recordsToFilter = recordsToFilter.filter(p => p.lastName.toLowerCase().includes(searchTerm)); }
    if (activeSearchFilters.birthDate) { recordsToFilter = recordsToFilter.filter(p => { if (!p.birth) return false; try { return p.birth.toISOString().split('T')[0] === activeSearchFilters.birthDate; } catch (e) { return false; } }); }
    if (activeSearchFilters.deathDate) { recordsToFilter = recordsToFilter.filter(p => { if (!p.death) return false; try { return p.death.toISOString().split('T')[0] === activeSearchFilters.deathDate; } catch (e) { return false; } }); }
    setFilteredData(recordsToFilter);
  }, [allRecords, activeSearchFilters]);

  // Search Handlers (remain the same)
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
  const handleSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => { /* ... */ };
  const handleResetSearch = () => { /* ... */ };
  // --- Delete Modal Logic (remains the same) ---
  const { isModalOpen: isDeleteModalOpen, recordToDelete, reauthEmail, setReauthEmail, reauthPassword, setReauthPassword, modalError: deleteModalError, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete, } = useDeleteConfirmation({ onDeleteSuccess: (deletedRecordId) => { refetchAllRecords(); setPlotToHighlight(null); } });
  // --- Info Modal Logic & Map Highlighting ---
  const { isInfoModalOpen, selectedRecordForInfo, openInfoModal: baseOpenInfoModal, closeInfoModal: baseCloseInfoModal, } = useRecordInfoModal();

  const openInfoModalAndHighlight = React.useCallback((person: Person) => {
    baseOpenInfoModal(person);
    // When opening info, set both the active ward and the specific plot to highlight
    if (person.block) {
      setActiveWardId(person.block); // Switch to the correct ward view
      if (typeof person.row === 'number' && typeof person.pos === 'number') {
        const plotIdentifier: PlotIdentifier = { block: person.block, row: person.row, pos: person.pos, rawId: `plot-${person.block}-${person.row}-${person.pos}` };
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

  // --- Map Click Handlers (Updated for Drill-Down) ---
  const handleMapPlotClick = React.useCallback((plotIdentifier: PlotIdentifier) => {
    if (activeWardId) {
      // We are in a DETAILED WARD VIEW, a plot was clicked
      const foundRecord = allRecords.find(p => p.block === plotIdentifier.block && p.row === plotIdentifier.row && p.pos === plotIdentifier.pos);
      if (foundRecord) {
        openInfoModalAndHighlight(foundRecord);
      } else {
        setPlotToHighlight(plotIdentifier); // Highlight the empty plot
        if (isInfoModalOpen) baseCloseInfoModal(); // Close any other info modal if open
        console.warn(`No record found for plot: ${plotIdentifier.rawId}`);
      }
    } else {
      // We are in the OVERVIEW MAP VIEW, a ward was clicked
      const clickedWardId = plotIdentifier.block; // The 'block' from a ward click is the ward ID
      if (wardComponentMap[clickedWardId]) { // Check if a detailed map component exists
        console.log(`Switching to detailed view for ward: ${clickedWardId}`);
        setActiveWardId(clickedWardId);
        setPlotToHighlight(null); // Clear any previous plot highlight when changing views
      } else {
        console.warn(`No detailed map component found for ward: ${clickedWardId}`);
        // Optionally show a notification to the user
      }
    }
  }, [allRecords, activeWardId, openInfoModalAndHighlight, baseCloseInfoModal, isInfoModalOpen]);

  const handleReturnToOverview = () => {
    setActiveWardId(null);
    setPlotToHighlight(null);
  };


  // --- Table Setup (remains the same) ---
  const columns = React.useMemo<ColumnDef<Person>[]>(() => [...staticPersonColumns], []);
  const table = useReactTable({ data: filteredData, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), initialState: { pagination: { pageSize: 10 } }, });
  
 if (loadingAuth) {
    return (
      <Layout>
        <div className="p-4 sm:p-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
          <p className="text-lg text-gray-500">Authenticating...</p>
        </div>
      </Layout>
    );
  }

  const SelectedWardComponent = activeWardId ? wardComponentMap[activeWardId] : null;

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

        {/* --- Map Section with Conditional Rendering --- */}
        {showMap && (
          <div className="mb-6 p-1 sm:p-2 border rounded-md bg-gray-50 shadow">
            <div className="flex justify-between items-center px-2 pt-1 mb-2">
                <h3 className="text-lg font-medium text-gray-800">
                    {activeWardId ? `Ward ${activeWardId} Details` : "Cemetery Overview"}
                </h3>
                {activeWardId && (
                    <Button variant="ghost" size="sm" onClick={handleReturnToOverview} className="flex items-center text-sm">
                        <ArrowLeft size={16} className="mr-1" /> Back to Main Map
                    </Button>
                )}
            </div>

            {activeWardId ? (
              // --- RENDER DETAILED WARD MAP ---
              SelectedWardComponent ? (
                <InteractiveCemeteryMap
                  key={activeWardId} // Force re-mount of map component when ward changes
                  SvgMapOverlayComponent={SelectedWardComponent as React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { ref?: React.Ref<SVGSVGElement> }>}
                  selectedPlotId={plotToHighlight ? plotToHighlight.rawId : null}
                  onPlotClick={handleMapPlotClick}
                />
              ) : (
                <div className="text-center py-20 text-red-600">
                  Detailed map for Ward '{activeWardId}' is not available.
                </div>
              )
            ) : (
              // --- RENDER OVERVIEW MAP ---
              <InteractiveCemeteryMap
                SvgMapOverlayComponent={
                  CemeteryMapSVG as React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { ref?: React.Ref<SVGSVGElement> }>
                }                
                selectedPlotId={null} // Highlighting on overview could highlight a whole ward
                onPlotClick={handleMapPlotClick}
              />
            )}
          </div>
        )}

        {/* Table Display Section */}
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
              onRowClick={openInfoModalAndHighlight} // Use new handler for row clicks
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
    </Layout>
  );
};

export default Records;