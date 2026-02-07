import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  author: IUser | string;
  status: 'draft' | 'published';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  softDelete(): Promise<IPost>;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  posts: T[];
  pagination: PaginationInfo;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  status?: 'draft' | 'published';
  tags?: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
  tags?: string[];
}

export interface PostQuery {
  page?: string;
  limit?: string;
  search?: string;
  tag?: string;
  author?: string;
  status?: string;
}
