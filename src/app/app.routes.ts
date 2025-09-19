import { Routes } from '@angular/router';
import { authRoutes } from '@auth/auth.routes';
import { passwords } from '@passwords/passwords.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'passwords',
  },
  ...authRoutes,
  ...passwords,
  {
    path: '**',
    redirectTo: 'passwords',
  },
];
