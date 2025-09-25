import { Routes } from '@angular/router';
import isValidToken from '@/auth/guards/isValidToken.guard';

export const homeRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home-page/home-page'),
    canActivate: [isValidToken],
  },
];
