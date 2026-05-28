import useAuthStore from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred during the request');
  }
  return response.json();
};

export const authApi = {
  // Register new user
  signup: async (userData: {
    name: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      }),
    });
    return handleResponse(response);
  },

  // Google Sign-in/Sign-up
  googleAuth: async (googleUser: {
    email: string;
    name: string;
    picture: string;
    sub: string;
  }) => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleUser),
    });
    return handleResponse(response);
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Refresh token
  refresh: async (refreshToken: string) => {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return handleResponse(response);
  },

  // Request password reset
  requestPasswordReset: async (email: string) => {
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Reset password with token
  resetPassword: async (token: string, userId: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId, newPassword }),
    });
    return handleResponse(response);
  },

  // Get current user
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    // In many setups logout returns 200 OK. 
    // Return early if not OK or proceed.
    if (!response.ok) {
      console.error('Logout failed on the backend.');
    }
    return { message: 'Logged out successfully' };
  },
};

// Axios/fetch-like interceptor for automatic token refresh
export const apiRequest = async <T,>(
  requestFn: () => Promise<T>,
  retryCount = 0
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error: any) {
    if (error.message.toLowerCase().includes('token') && retryCount === 0) {
      // Try to refresh token
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const refreshData = await authApi.refresh(refreshToken);
          useAuthStore.getState().login(refreshData.user, refreshData.token, refreshData.refreshToken);
          // Retry original request
          return apiRequest(requestFn, retryCount + 1);
        } catch {
          // Refresh failed, logout
          useAuthStore.getState().logout();
        }
      }
    }
    throw error;
  }
};

export default authApi;

