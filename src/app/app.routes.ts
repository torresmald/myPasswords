import { Routes } from '@angular/router';
import { authRoutes } from '@auth/auth.routes';
import { passwords } from '@passwords/passwords.routes';
import { homeRoutes } from './home/home.routes';
import { categories } from './category/categories.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  ...homeRoutes,
  ...authRoutes,
  ...passwords,
  ...categories,
  {
    path: '**',
    redirectTo: 'home',
  },
];
