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
import { useUserAuth } from '@/context/userAuthContext';

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
import { Search, RotateCcw, MapPin } from "lucide-react"; // Added MapPin icon

// --- Import the Map Component and helpers ---
import {
  InteractiveCemeteryMap,
  PlotIdentifier,
} from '../../components/maps/InteractiveCemeteryMap'; // Adjust path as needed
// If you import your SVG as a React Component (e.g. using SVGR)
import { CemeteryMapSVG } from '../../components/maps/CemeteryMapSVG.tsx';


interface IRecordsProps { }

const Records: React.FunctionComponent<IRecordsProps> = (props) => {
  const { user, loadingAuth } = useUserAuth();

  // --- Search Filters State ---
  const initialSearchFilters: RecordSearchFilters = {
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
  };
  const [searchFilters, setSearchFilters] = React.useState<RecordSearchFilters>(initialSearchFilters);
  const [activeSearchFilters, setActiveSearchFilters] = React.useState<RecordSearchFilters>(initialSearchFilters);

  // --- Data Fetching ---
  const { data: allRecords, isLoadingRecords, fetchError, refetchRecords: refetchAllRecords } = useRecordsData(user, loadingAuth);
  const [filteredData, setFilteredData] = React.useState<Person[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // --- State for Map Interaction ---
  const [plotToHighlight, setPlotToHighlight] = React.useState<string | null>(null); // e.g., "A-1-1"
  const [showMap, setShowMap] = React.useState(false);


  // --- Client-Side Filtering Logic ---
  React.useEffect(() => {
    let recordsToFilter = [...allRecords];
    // Apply First Name Filter
    if (activeSearchFilters.firstName) {
      const searchTerm = activeSearchFilters.firstName.toLowerCase();
      recordsToFilter = recordsToFilter.filter(person =>
        person.firstName.toLowerCase().includes(searchTerm)
      );
    }
    // Apply Last Name Filter
    if (activeSearchFilters.lastName) {
      const searchTerm = activeSearchFilters.lastName.toLowerCase();
      recordsToFilter = recordsToFilter.filter(person =>
        person.lastName.toLowerCase().includes(searchTerm)
      );
    }
    // Apply Birth Date Filter
    if (activeSearchFilters.birthDate) {
      recordsToFilter = recordsToFilter.filter(person => {
        if (!person.birth) return false;
        try {
          const personBirthDateStr = person.birth.toISOString().split('T')[0];
          return personBirthDateStr === activeSearchFilters.birthDate;
        } catch (e) { return false; }
      });
    }
    // Apply Death Date Filter
    if (activeSearchFilters.deathDate) {
      recordsToFilter = recordsToFilter.filter(person => {
        if (!person.death) return false;
        try {
          const personDeathDateStr = person.death.toISOString().split('T')[0];
          return personDeathDateStr === activeSearchFilters.deathDate;
        } catch (e) { return false; }
      });
    }
    setFilteredData(recordsToFilter);
  }, [allRecords, activeSearchFilters]);

  // --- Search Handlers ---
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
  const {
    isModalOpen: isDeleteModalOpen, recordToDelete,
    reauthEmail, setReauthEmail, reauthPassword, setReauthPassword,
    modalError: deleteModalError, isDeleting,
    openDeleteModal, closeDeleteModal, confirmDelete,
  } = useDeleteConfirmation({
    onDeleteSuccess: (deletedRecordId) => {
      refetchAllRecords(); // Refetch the entire base dataset after a delete
      setPlotToHighlight(null); // Clear map highlight after delete
      console.log("Record deleted, refetching all data (ID):", deletedRecordId);
    }
  });

  // --- Info Modal Logic & Map Highlighting ---
  const {
    isInfoModalOpen, selectedRecordForInfo,
    openInfoModal: baseOpenInfoModal,
    closeInfoModal: baseCloseInfoModal,
  } = useRecordInfoModal();

  const openInfoModalAndHighlight = React.useCallback((person: Person) => {
    baseOpenInfoModal(person);
    if (person.block && typeof person.row === 'number' && typeof person.pos === 'number') {
      setPlotToHighlight(`${person.block}-${person.row}-${person.pos}`);
    } else {
      setPlotToHighlight(null);
    }
  }, [baseOpenInfoModal]);

  const closeInfoModalAndClearHighlight = React.useCallback(() => {
    baseCloseInfoModal();
    setPlotToHighlight(null);
  }, [baseCloseInfoModal]);

  // --- Permission Check ---
  const canManageSelectedRecord = useRecordManagementPermission(user, selectedRecordForInfo);

  // --- Edit Click Handler ---
  const handleEditClick = React.useCallback((personToEdit: Person) => {
    console.log("Edit:", personToEdit);
    // TODO: Implement actual edit logic
    closeInfoModalAndClearHighlight(); // Use the new handler
  }, [closeInfoModalAndClearHighlight]);

  // --- Map Plot Click Handler ---
  const handleMapPlotClick = React.useCallback((plotIdentifier: PlotIdentifier) => {
    const plotIdStr = `${plotIdentifier.block}-${plotIdentifier.row}-${plotIdentifier.pos}`;
    const foundRecord = allRecords.find(
      p => p.block === plotIdentifier.block && p.row === plotIdentifier.row && p.pos === plotIdentifier.pos
    );

    if (foundRecord) {
      openInfoModalAndHighlight(foundRecord);
    } else {
      // If no record, still highlight the plot, close any non-matching open info modal
      setPlotToHighlight(plotIdStr);
      if (isInfoModalOpen && selectedRecordForInfo &&
        plotToHighlight !== plotIdStr // Check if it's a different plot
      ) {
        baseCloseInfoModal(); // Close previous modal but retain current map highlight
      }
      console.warn(`No record found for plot: ${plotIdStr}`);
    }
  }, [allRecords, openInfoModalAndHighlight, baseCloseInfoModal, isInfoModalOpen, selectedRecordForInfo, plotToHighlight]);


  // --- Table Setup ---
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [...staticPersonColumns],
    []
  );
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loadingAuth) {
    return (
      <Layout>
        <div className="p-4 sm:p-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
          <p className="text-lg text-gray-500">Authenticating...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl mx-auto max-w-full xl:max-w-screen-2xl"> {/* Allow wider layout */}
        {/* Search UI & Map Toggle Button */}
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

        {/* Conditionally render Map */}
        {showMap && (
          <div className="mb-6 p-1 sm:p-2 border rounded-md bg-gray-50 shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-2 px-2 pt-1">Cemetery Map</h3>
            <InteractiveCemeteryMap
              // If using SvgMapComponent prop for an imported SVG component:
              SvgMapOverlayComponent={CemeteryMapSVG}
              selectedPlotId={plotToHighlight}
              onPlotClick={handleMapPlotClick} 
              backgroundImageUrl={''} />
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
// Re-add the missing parts for copy-pasting the full component
const RecordsLoadingAuthPlaceholder: React.FunctionComponent<IRecordsProps> = (props) => {
  return (<Layout> <div className="p-4 sm:p-6 flex justify-center items-center min-h-[calc(100vh-200px)]"> <p className="text-lg text-gray-500">Authenticating...</p> </div> </Layout>);
}


export default Records;