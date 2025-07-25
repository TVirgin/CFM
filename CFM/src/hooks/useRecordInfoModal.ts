import * as React from 'react';
import { Person } from '@/pages/records/records.types'; // Adjust path if your types are elsewhere

export function useRecordInfoModal() {
  const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
  const [selectedRecordForInfo, setSelectedRecordForInfo] = React.useState<Person | null>(null);

  const openInfoModal = React.useCallback((person: Person) => {
    setSelectedRecordForInfo(person);
    setIsInfoModalOpen(true);
  }, []);

  const closeInfoModal = React.useCallback(() => {
    setIsInfoModalOpen(false);
    // Optionally clear selectedRecordForInfo after a short delay for smoother closing animation
    // setTimeout(() => setSelectedRecordForInfo(null), 300); // Based on modal animation duration
    setSelectedRecordForInfo(null);
  }, []);

  return {
    isInfoModalOpen,
    selectedRecordForInfo,
    openInfoModal,
    closeInfoModal,
  };
}