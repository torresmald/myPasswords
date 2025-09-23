import { Routes } from '@angular/router';
import isValidToken from './guards/isValidToken.guard';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth-page/auth-page'),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login'),
        canActivate: [isValidToken],
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register'),
        canActivate: [isValidToken],
      },
      {
        path: 'update',
        loadComponent: () => import('./components/update-data/update-data'),
        canActivate: [isValidToken],
      },
      {
        path: 'confirm-account/:token',
        loadComponent: () => import('./components/confirm-account/confirm-account'),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./components/forgot-password/forgot-password'),
      },
      {
        path: 'forgot-password/:token',
        loadComponent: () => import('./components/forgot-password-reset/forgot-password-reset'),
      },
    ],
  },
];
