import { UserApi } from '@/auth/interfaces';
import { Category, PaginationData } from '../../category/interfaces/category.interface';

export interface Password {
  id: string;
  name: string;
  category: Category;
  password?: string;
  user: UserApi;
}

export interface PasswordApiResponse {
  data: Password[];
  pagination: PaginationData;
}
