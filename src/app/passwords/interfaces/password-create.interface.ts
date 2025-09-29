import { Category } from '@/category/interfaces';

export interface CreatePassword {
  name: string;
  categoryId: string;
  password: string;
  userId: string;
}

export interface CreatePasswordApiResponse extends CreatePassword {
  id: string;
  category: Category;
  message: string;
}
