import isValidToken from '@/auth/guards/isValidToken.guard';
import { Routes } from '@angular/router';

export const categories: Routes = [
  {
    path: 'categories',
    loadComponent: () => import('./pages/category-page/category-page'),
    canActivate: [isValidToken],

  }
];
