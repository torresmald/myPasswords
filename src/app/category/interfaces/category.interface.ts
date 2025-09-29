import { UserApi } from '@/auth/interfaces';

export interface CategoryApiResponse {
  data: Category[];
  pagination: PaginationData;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Category {
  id: string;
  name: string;
  user: UserApi;
  image?: string;
}

export interface CreateCategory {
  name: string;
  userId: string;
  image?: File;
}

export interface UpdateCategory extends CreateCategory {
  categoryId: string;
}
