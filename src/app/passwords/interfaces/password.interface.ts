import { UserApi } from '@/auth/interfaces';
import { Category } from '../../category/interfaces/category.interface';

export interface Password {
  id: string;
  name: string;
  category: Category;
  password?: string;
  user: UserApi;
}

export interface CreatePassword {
  name: string;
  idCategory: string;
  password: string;
  userId: string
}

export interface CreatePasswordApiResponse{
  id: string,
  name: string,
  category: Category,
  message: string
}
