import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth-page/auth-page'),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login'),
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register'),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
