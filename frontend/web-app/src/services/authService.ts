import apiClient from './apiClient';
import type { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/login', payload);
  // Backend returns { success, data: { token, user } }
  return data.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/register', payload);
  // Backend returns { success, data: { token, user } }
  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get('/auth/profile');
  // Backend returns { success, data: { user } }
  return data.data.user;
}
