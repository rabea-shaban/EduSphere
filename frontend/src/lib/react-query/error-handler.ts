import { toast } from "react-hot-toast";

export interface ApiError extends Error {
  statusCode?: number;
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

/**
 * Parses API errors cleanly and returns a human-readable Arabic error message.
 */
export function parseErrorMessage(error: unknown, fallbackMessage: string = "حدث خطأ غير متوقع"): string {
  if (!error) return fallbackMessage;

  const err = error as ApiError;

  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (err.response?.data?.error) {
    return err.response.data.error;
  }

  if (err.message) {
    return err.message;
  }

  return fallbackMessage;
}

/**
 * Displays a toast error notification with a standardized error message.
 */
export function handleApiError(error: unknown, fallbackMessage: string = "حدث خطأ أثناء إجراء العملية"): string {
  const message = parseErrorMessage(error, fallbackMessage);
  toast.error(message);
  return message;
}
