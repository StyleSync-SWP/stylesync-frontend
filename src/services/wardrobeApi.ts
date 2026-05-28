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

export const wardrobeApi = {
  getWardrobe: async () => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/wardrobe`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(response);
    });
  },

  addGarment: async (garmentData: { name: string; image_base64: string; brand?: string; code?: string }) => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/wardrobe/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(garmentData),
      });
      return handleResponse(response);
    });
  },

  deleteGarment: async (garmentId: string) => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/wardrobe/${garmentId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    });
  },

  updateGarment: async (garmentId: string, updateData: any) => {
    return apiRequest(async () => {
      const response = await fetch(`${API_URL}/wardrobe/${garmentId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });
      return handleResponse(response);
    });
  },
};
