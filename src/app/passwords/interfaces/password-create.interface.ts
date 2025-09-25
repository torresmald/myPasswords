import { Category } from '@/category/interfaces';

export interface CreatePassword {
  name: string;
  idCategory: string;
  password: string;
  userId: string;
}

export interface CreatePasswordApiResponse {
  id: string;
  name: string;
  category: Category;
  message: string;
}
