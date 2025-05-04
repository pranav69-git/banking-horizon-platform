
import { useEffect } from 'react';
import { useRealTimeTransactions } from '@/hooks/use-real-time-transactions';
import { useUserContext } from '@/contexts/UserContext';

// This component helps set up the app with initial dummy data only when logged in
export function AppSetup() {
  const { isAuthenticated } = useUserContext();
  
  // Skip any setup if not authenticated to avoid unwanted popups
  if (!isAuthenticated) {
    return null;
  }
  
  // Only fetch transactions when authenticated
  useRealTimeTransactions([], false); // Pass false to avoid showing toasts during initial load
  
  // This is an invisible component, it just sets up data
  return null;
}
