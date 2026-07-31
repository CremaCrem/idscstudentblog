export type UserRole = 'student' | 'admin';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName?: string;
  studentId?: string;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
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
  fullName: string;
  studentId: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}
