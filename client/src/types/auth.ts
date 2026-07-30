export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; issue: string }>;
  };
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}
