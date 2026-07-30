import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1';

/**
 * Utility for making API requests with credentials (cookies)
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include' // Send cookies
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || 'An unexpected error occurred.';
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.code = data?.error?.code;
    error.details = data?.error?.details;
    throw error;
  }

  return data as T;
}

export const authApi = {
  register: (payload: RegisterPayload) => request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  login: (payload: LoginPayload) => request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  logout: () => request<AuthResponse>('/auth/logout', {
    method: 'POST'
  }),

  getMe: () => request<AuthResponse>('/auth/me', {
    method: 'GET'
  })
};
