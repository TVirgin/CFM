// src/pages/Records/index.tsx

import Layout from '@/components/layout';
import * as React from 'react';
import './index.css'; // Your existing styles
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel, // Import for sorting
  SortingState,      // Import for sorting state type
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
import { Search, RotateCcw } from "lucide-react";

interface IRecordsProps {}

const Records: React.FunctionComponent<IRecordsProps> = (props) => {
  const { user, loadingAuth } = useUserAuth();

  const initialSearchFilters: RecordSearchFilters = {
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
  };
  const [searchFilters, setSearchFilters] = React.useState<RecordSearchFilters>(initialSearchFilters);
  const [activeSearchFilters, setActiveSearchFilters] = React.useState<RecordSearchFilters>(initialSearchFilters);

  const { data: allRecords, isLoadingRecords, fetchError, refetchRecords: refetchAllRecords } = useRecordsData(user, loadingAuth);
  const [filteredData, setFilteredData] = React.useState<Person[]>([]);

  // --- Add State for Sorting ---
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Client-Side Filtering Logic (remains the same)
  React.useEffect(() => {
    let recordsToFilter = [...allRecords];

    if (activeSearchFilters.firstName) {
      const searchTerm = activeSearchFilters.firstName.toLowerCase();
      recordsToFilter = recordsToFilter.filter(person =>
        person.firstName.toLowerCase().includes(searchTerm)
      );
    }
    if (activeSearchFilters.lastName) {
      const searchTerm = activeSearchFilters.lastName.toLowerCase();
      recordsToFilter = recordsToFilter.filter(person =>
        person.lastName.toLowerCase().includes(searchTerm)
      );
    }
    if (activeSearchFilters.birthDate) {
      recordsToFilter = recordsToFilter.filter(person => {
        if (!person.birth) return false;
        try {
            const personBirthDateStr = person.birth.toISOString().split('T')[0];
            return personBirthDateStr === activeSearchFilters.birthDate;
        } catch (e) { return false; }
      });
    }
    if (activeSearchFilters.deathDate) {
      recordsToFilter = recordsToFilter.filter(person => {
        if (!person.death) return false;
        try {
            const personDeathDateStr = person.death.toISOString().split('T')[0];
            return personDeathDateStr === activeSearchFilters.deathDate;
        } catch(e) { return false; }
      });
    }
    setFilteredData(recordsToFilter);
  }, [allRecords, activeSearchFilters]);

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

  const {
    isModalOpen: isDeleteModalOpen, recordToDelete,
    reauthEmail, setReauthEmail, reauthPassword, setReauthPassword,
    modalError: deleteModalError, isDeleting,
    openDeleteModal, closeDeleteModal, confirmDelete,
  } = useDeleteConfirmation({
    onDeleteSuccess: (deletedRecordId) => {
      refetchAllRecords();
      console.log("Record deleted, refetching all data (ID):", deletedRecordId);
    }
  });

  const {
    isInfoModalOpen, selectedRecordForInfo,
    openInfoModal, closeInfoModal,
  } = useRecordInfoModal();

  const canManageSelectedRecord = useRecordManagementPermission(user, selectedRecordForInfo);

  const handleEditClick = React.useCallback((personToEdit: Person) => {
    console.log("Edit:", personToEdit);
    closeInfoModal();
  }, [closeInfoModal]);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [...staticPersonColumns],
    []
  );

  // Update useReactTable to include sorting configuration
  const table = useReactTable({
    data: filteredData, // Data source is the client-side filtered data
    columns,
    state: { // Pass sorting state to the table
      sorting,
    },
    onSortingChange: setSorting, // Function to update your sorting state
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // Enable the sorting row model
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
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl mx-auto max-w-7xl">
        {/* --- Search UI --- */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Search first name..." value={searchFilters.firstName} onChange={handleSearchInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Search last name..." value={searchFilters.lastName} onChange={handleSearchInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" type="date" value={searchFilters.birthDate} onChange={handleSearchInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="deathDate">Death Date</Label>
              <Input id="deathDate" type="date" value={searchFilters.deathDate} onChange={handleSearchInputChange} />
            </div>
            <div className="flex space-x-2 sm:col-span-2 md:col-span-2 lg:col-span-4 lg:justify-start mt-4 lg:mt-0">
              <Button type="submit" className="flex items-center">
                <Search size={18} className="mr-2" /> Search
              </Button>
              <Button type="button" variant="outline" onClick={handleResetSearch} className="flex items-center">
                <RotateCcw size={18} className="mr-2" /> Reset
              </Button>
            </div>
          </form>
        </div>

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
                  onRowClick={openInfoModal}
                  isLoading={false}
                  hasError={false}
                />
                {filteredData.length === 0 && !isLoadingRecords && !fetchError && ( // Ensure not to show during initial load or if there was an error
                    <div className="text-center py-10 text-gray-500">
                        No records found matching your criteria.
                    </div>
                )}
                {filteredData.length > 0 && !isLoadingRecords && !fetchError && (
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
        isOpen={isInfoModalOpen} onClose={closeInfoModal} record={selectedRecordForInfo}
        canManage={canManageSelectedRecord}
        onEdit={() => { if (selectedRecordForInfo) handleEditClick(selectedRecordForInfo); }}
        onDelete={() => { if (selectedRecordForInfo) { closeInfoModal(); setTimeout(() => openDeleteModal(selectedRecordForInfo), 50); }}}
      />
    </Layout>
  );
};

export default Records;