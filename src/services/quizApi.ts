import { apiRequest } from './authApi';
import useAuthStore from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred during the request');
  }
  return response.json();
};

export interface StyleProfileResult {
  profile_key: string;
  title: string;
  tagline: string;
  description: string;
  color_palette: string[];
  keywords: string[];
  scores: Record<string, number>;
  created_at: string;
}

export const quizApi = {
  submitQuiz: async (answers: Record<string, unknown>): Promise<StyleProfileResult> => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ answers }),
      });
      return handleResponse(response);
    });
  },

  getResult: async (): Promise<StyleProfileResult> => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/quiz/result`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(response);
    });
  },
};

export default quizApi;
