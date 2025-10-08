/**
 * Utility functions for handling and extracting error messages
 */

export interface ApiError {
  data?: {
    message?: string;
    error?: string;
  };
  message?: string;
  status?: number;
  statusText?: string;
}

export interface NextAuthError {
  error?: string;
  message?: string;
}

/**
 * Extract error message from various error formats
 */
export const extractErrorMessage = (error: any, fallback: string = "An error occurred"): string => {
  // Handle null/undefined
  if (!error) return fallback;

  // Handle string errors
  if (typeof error === 'string') return error;

  // Handle RTK Query errors
  if (error?.data?.message) {
    return error.data.message;
  }

  // Handle RTK Query errors with error field
  if (error?.data?.error) {
    return error.data.error;
  }

  // Handle standard Error objects
  if (error?.message) {
    return error.message;
  }

  // Handle NextAuth errors
  if (error?.error) {
    return error.error;
  }

  // Handle fetch errors
  if (error?.statusText) {
    return error.statusText;
  }

  // Fallback
  return fallback;
};

/**
 * Extract detailed error information for debugging
 */
export const extractErrorDetails = (error: any) => {
  return {
    message: extractErrorMessage(error),
    status: error?.status,
    statusText: error?.statusText,
    data: error?.data,
    originalError: error,
  };
};

/**
 * Show error alert with proper message extraction
 */
export const showErrorAlert = (error: any, title: string = "Error", fallback: string = "An error occurred") => {
  const message = extractErrorMessage(error, fallback);
  
  // You can customize this based on your alert library
  return {
    title,
    message,
    type: 'error' as const,
  };
};

/**
 * Show success alert
 */
export const showSuccessAlert = (message: string, title: string = "Success") => {
  return {
    title,
    message,
    type: 'success' as const,
  };
};

