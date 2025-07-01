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
import { Person, RecordSearchFilters, PlotIdentifier } from './records.types';
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

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

// --- NEW COMPONENT IMPORTS ---
import { RecordSearchForm } from './RecordSearchForm';
import { CemeteryMapManager } from './CemeteryMapManager';


const Records: React.FunctionComponent = () => {
  const { user, loadingAuth } = useUserAuth();

  // --- State for Data and Filtering ---
  const { data: allRecords, isLoadingRecords, fetchError, refetchRecords: refetchAllRecords } = useRecordsData(user, loadingAuth);
  const [activeSearchFilters, setActiveSearchFilters] = React.useState<RecordSearchFilters>({ firstName: '', lastName: '', birthDate: '', deathDate: '' });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  // --- State for Map/Table Interaction ---
  const [showMap, setShowMap] = React.useState(true);
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(null);
  const [plotToHighlight, setPlotToHighlight] = React.useState<PlotIdentifier | null>(null);

  // --- Derived State: Filtered Data for Table ---
  const filteredData = React.useMemo(() => {
    let recordsToFilter = [...allRecords];

    if (activeBlockId) {
      recordsToFilter = recordsToFilter.filter(person => person.block === activeBlockId);
    }
    
    // Apply search filters
    const { firstName, lastName, birthDate, deathDate } = activeSearchFilters;
    if (firstName) recordsToFilter = recordsToFilter.filter(p => p.firstName.toLowerCase().includes(firstName.toLowerCase()));
    if (lastName)  recordsToFilter = recordsToFilter.filter(p => p.lastName.toLowerCase().includes(lastName.toLowerCase()));
    if (birthDate) recordsToFilter = recordsToFilter.filter(p => p.birth && p.birth.includes(birthDate));
    if (deathDate) recordsToFilter = recordsToFilter.filter(p => p.death && p.death.includes(deathDate));

    return recordsToFilter;
  }, [allRecords, activeSearchFilters, activeBlockId]);

  // --- Search Handlers ---
  const handleSearch = (filters: RecordSearchFilters) => {
    setActiveSearchFilters(filters);
  };
  const handleReset = () => {
    setActiveSearchFilters({ firstName: '', lastName: '', birthDate: '', deathDate: '' });
  };
  
  // --- Modal Logic ---
  const { isModalOpen: isDeleteModalOpen, ...deleteModalProps } = useDeleteConfirmation({ onDeleteSuccess: () => refetchAllRecords() });
  const { isInfoModalOpen, selectedRecordForInfo, openInfoModal, closeInfoModal } = useRecordInfoModal();
  const canManageSelectedRecord = useRecordManagementPermission(user, selectedRecordForInfo);

  // --- Interaction Handlers ---
  const handleRowOrPlotClick = React.useCallback((person: Person) => {
    openInfoModal(person);
    // If the person has a location, highlight it
    if (person.block && typeof person.lot === 'number' && typeof person.pos === 'number') {
      setActiveBlockId(person.block); // Ensure we are viewing the correct block
      setPlotToHighlight({ block: person.block, lot: person.lot, pos: person.pos, rawId: `plot-${person.block}-${person.lot}-${person.pos}` });
    }
  }, [openInfoModal]);

  const handleMapPlotClick = React.useCallback((plotIdentifier: PlotIdentifier) => {
    const foundRecord = allRecords.find(p => 
      p.block === plotIdentifier.block && p.lot === plotIdentifier.lot && p.pos === plotIdentifier.pos
    );
    if (foundRecord) {
      handleRowOrPlotClick(foundRecord);
    } else {
      // It's an empty plot, just highlight it and close any open info modal
      setPlotToHighlight(plotIdentifier);
      if(isInfoModalOpen) closeInfoModal();
    }
  }, [allRecords, handleRowOrPlotClick, isInfoModalOpen, closeInfoModal]);
  
  const handleCloseInfoModal = () => {
    closeInfoModal();
    setPlotToHighlight(null);
  };

  // --- Table Setup ---
  const columns = React.useMemo<ColumnDef<Person>[]>(() => [...staticPersonColumns], []);
  const table = useReactTable({
    data: filteredData, columns, state: { sorting }, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loadingAuth) {
    return <Layout><div className="p-6 text-center">Authenticating...</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl mx-auto max-w-full xl:max-w-screen-2xl">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
              {user ? "Cemetery Records" : "Public Records"}
            </h1>
            <Button variant="outline" onClick={() => setShowMap(!showMap)} className="flex items-center w-full sm:w-auto">
              <MapPin size={18} className="mr-2" /> {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
          <RecordSearchForm
            initialFilters={{ firstName: '', lastName: '', birthDate: '', deathDate: '' }}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {showMap && (
            <div className="lg:w-1/2 xl:w-2/5"> {/* Give map a container with a defined width */}
                <CemeteryMapManager
                    user={user}
                    activeBlockId={activeBlockId}
                    plotToHighlight={plotToHighlight}
                    recordsForBlock={filteredData} // Pass already filtered data for the active block
                    onBlockChange={setActiveBlockId}
                    onPlotClick={handleMapPlotClick}
                />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {isLoadingRecords ? (
                <div className="text-center py-10 text-gray-500">Loading records...</div>
            ) : fetchError ? (
                <div className="my-4 p-4 bg-red-100 text-red-700 rounded-md">Error: {fetchError}</div>
            ) : (
              <>
                <RecordsTableDisplay table={table} onRowClick={handleRowOrPlotClick} />
                {filteredData.length === 0 && <div className="text-center py-10 text-gray-500">No records found.</div>}
                {filteredData.length > 0 && <RecordsPagination table={table} />}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} {...deleteModalProps} />
      <RecordInfoModal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        record={selectedRecordForInfo}
        canManage={canManageSelectedRecord}
        onDelete={() => {
            if (selectedRecordForInfo) {
                handleCloseInfoModal();
                setTimeout(() => deleteModalProps.openDeleteModal(selectedRecordForInfo), 50);
            }
        }}
        onEdit={() => { /* Navigate to edit page or open edit modal */ }}
      />
      
    </Layout>
  );
};

export default Records;