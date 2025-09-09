import { useState, useCallback } from 'react';
import apiClient, { HealthAssessment, ApiResponse } from '../api/client';

export interface UseHealthAssessmentOptions {
  onAssessmentComplete?: (assessment: HealthAssessment) => void;
  onError?: (error: string) => void;
}

export interface UseHealthAssessmentReturn {
  assessment: HealthAssessment | null;
  isAssessing: boolean;
  error: string | null;
  assessSymptoms: (symptoms: string[], additionalInfo?: Record<string, any>) => Promise<boolean>;
  clearAssessment: () => void;
}

export const useHealthAssessment = (
  options: UseHealthAssessmentOptions = {}
): UseHealthAssessmentReturn => {
  const { onAssessmentComplete, onError } = options;

  const [assessment, setAssessment] = useState<HealthAssessment | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assessSymptoms = useCallback(async (
    symptoms: string[],
    additionalInfo?: Record<string, any>
  ): Promise<boolean> => {
    if (!symptoms.length) {
      setError('Please provide at least one symptom');
      return false;
    }

    setIsAssessing(true);
    setError(null);

    try {
      const response: ApiResponse<HealthAssessment> = await apiClient.assessHealthSymptoms(
        symptoms,
        additionalInfo
      );

      if (response.success && response.data) {
        setAssessment(response.data);
        onAssessmentComplete?.(response.data);
        return true;
      } else {
        const errorMsg = response.error || 'Failed to assess symptoms';
        setError(errorMsg);
        onError?.(errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg = 'Network error. Please check your connection.';
      setError(errorMsg);
      onError?.(errorMsg);
      return false;
    } finally {
      setIsAssessing(false);
    }
  }, [onAssessmentComplete, onError]);

  const clearAssessment = useCallback(() => {
    setAssessment(null);
    setError(null);
  }, []);

  return {
    assessment,
    isAssessing,
    error,
    assessSymptoms,
    clearAssessment,
  };
};