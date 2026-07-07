import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAuthStore from '../../stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in user correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'USER' as const };
    const mockToken = 'mock-jwt-token';
    const mockRefreshToken = 'mock-refresh-token';

    act(() => {
      result.current.login(mockUser, mockToken, mockRefreshToken);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.refreshToken).toBe(mockRefreshToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logs out user correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'USER' as const };

    act(() => {
      result.current.login(mockUser, 'token', 'refresh-token');
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('updates user information', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'USER' as const };

    act(() => {
      result.current.login(mockUser, 'token', 'refresh-token');
    });

    act(() => {
      result.current.updateUser({ name: 'Updated User' });
    });

    expect(result.current.user?.name).toBe('Updated User');
  });
});
