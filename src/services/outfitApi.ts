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

interface OutfitSuggestPayload {
  query: string;
  explicit_filters?: {
    occasions: string[];
    styles: string[];
    colors: string[];
  } | null;
}

export const outfitApi = {
  suggestOutfit: async (payload: OutfitSuggestPayload) => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/outfits/suggest`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(response);
    });
  },

  getHistory: async () => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/outfits/history`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(response);
    });
  },

  rateOutfit: async (outfitId: string, data: { rating?: number; is_favorite?: boolean }) => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/outfits/${outfitId}/rate`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    });
  },

  deleteOutfit: async (outfitId: string) => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/outfits/${outfitId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    });
  },
};