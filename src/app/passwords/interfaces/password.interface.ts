import { UserApi } from '@/auth/interfaces';
import { Category } from '../../category/interfaces/category.interface';

export interface Password {
  id: string;
  name: string;
  category: Category;
  password?: string;
  user: UserApi;
}

