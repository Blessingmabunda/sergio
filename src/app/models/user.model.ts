export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  company: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DATA_MANAGER = 'data_manager'
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}