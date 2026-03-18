import { userRepository } from '../repositories/index.js';
import { generateToken } from '../middlewares/auth.js';
import { ApiError } from '../middlewares/errorHandler.js';
import type { IUserPayload } from '../types/index.js';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export const authService = {
  async register(data: RegisterData): Promise<{ message: string }> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError('Email already registered', 400);
    }

    await userRepository.create(data);

    return { message: 'User registered successfully' };
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    const payload: IUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async getProfile(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
  }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};
