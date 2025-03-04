import { authApi } from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authApi.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await authApi.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },
};
