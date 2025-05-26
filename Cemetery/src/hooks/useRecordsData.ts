// src/hooks/useRecordsData.ts
import * as React from 'react';
import { Person } from '@/pages/records/records.types'; // Adjust path as needed
import { getRecords } from '@/services/recordService'; // Adjust path
import { User } from 'firebase/auth'; // Assuming User type from firebase/auth

interface UseRecordsDataReturn {
  data: Person[];
  isLoadingRecords: boolean;
  fetchError: string | null;
  refetchRecords: () => void; // Function to manually refetch data
}

export function useRecordsData(user: User | null, loadingAuth: boolean): UseRecordsDataReturn {
  const [data, setData] = React.useState<Person[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const loadUserRecords = React.useCallback(async () => {
    // if (!user) {
    //   setData([]);
    //   setIsLoadingRecords(false);
    //   setFetchError(null);
    //   return;
    // }

    setIsLoadingRecords(true);
    setFetchError(null);
    try {
      const userRecords = await getRecords();
      setData(userRecords);
    } catch (error: any) {
      console.error("Error fetching records in hook:", error);
      setFetchError(error.message || "Failed to fetch records.");
    } finally {
      setIsLoadingRecords(false);
    }
  }, [user]); // Dependency: user

  React.useEffect(() => {
    if (!loadingAuth) { // Only fetch when auth state is resolved
      loadUserRecords();
    }
  }, [loadingAuth, loadUserRecords]); // Dependencies: loadingAuth and the memoized loadUserRecords

  return { data, isLoadingRecords, fetchError, refetchRecords: loadUserRecords };
}