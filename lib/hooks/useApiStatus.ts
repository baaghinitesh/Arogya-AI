import { useState, useEffect, useCallback } from 'react';
import apiClient, { ApiResponse } from '../api/client';

export interface ApiStatus {
  api: boolean;
  database: boolean;
  rasa: boolean;
  whatsapp: boolean;
}

export interface UseApiStatusOptions {
  pollInterval?: number; // in milliseconds
  autoStart?: boolean;
}

export interface UseApiStatusReturn {
  status: ApiStatus | null;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
  checkStatus: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
}

export const useApiStatus = (
  options: UseApiStatusOptions = {}
): UseApiStatusReturn => {
  const { pollInterval = 30000, autoStart = false } = options; // Default 30 seconds

  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollIntervalId, setPollIntervalId] = useState<NodeJS.Timeout | null>(null);

  const checkStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check overall API health first
      const healthResponse = await apiClient.healthCheck();
      
      if (healthResponse.success) {
        // Get detailed status
        const statusResponse: ApiResponse<ApiStatus> = await apiClient.getApiStatus();
        
        if (statusResponse.success && statusResponse.data) {
          setStatus(statusResponse.data);
          setLastChecked(new Date());
        } else {
          setError(statusResponse.error || 'Failed to get API status');
          // Set partial status if health check passed but status check failed
          setStatus({
            api: true,
            database: false,
            rasa: false,
            whatsapp: false,
          });
        }
      } else {
        setError(healthResponse.error || 'API is not accessible');
        setStatus({
          api: false,
          database: false,
          rasa: false,
          whatsapp: false,
        });
      }
    } catch (err) {
      setError('Network error. Unable to check API status.');
      setStatus({
        api: false,
        database: false,
        rasa: false,
        whatsapp: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollIntervalId) {
      clearInterval(pollIntervalId);
    }

    setIsPolling(true);
    
    // Check immediately
    checkStatus();
    
    // Set up polling
    const intervalId = setInterval(checkStatus, pollInterval);
    setPollIntervalId(intervalId);
  }, [checkStatus, pollInterval, pollIntervalId]);

  const stopPolling = useCallback(() => {
    if (pollIntervalId) {
      clearInterval(pollIntervalId);
      setPollIntervalId(null);
    }
    setIsPolling(false);
  }, [pollIntervalId]);

  // Auto-start polling if enabled
  useEffect(() => {
    if (autoStart) {
      startPolling();
    }

    // Cleanup on unmount
    return () => {
      if (pollIntervalId) {
        clearInterval(pollIntervalId);
      }
    };
  }, [autoStart, startPolling]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalId) {
        clearInterval(pollIntervalId);
      }
    };
  }, [pollIntervalId]);

  return {
    status,
    isLoading,
    error,
    lastChecked,
    checkStatus,
    startPolling,
    stopPolling,
    isPolling,
  };
};