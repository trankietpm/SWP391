import axios from 'axios';

export const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const errorData = error.response.data as { message?: string; error?: string };
      const errorMessage = errorData?.message || errorData?.error || defaultMessage;
      throw new Error(errorMessage);
    }
    if (error.request) {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
  throw new Error(error instanceof Error ? error.message : defaultMessage);
};

