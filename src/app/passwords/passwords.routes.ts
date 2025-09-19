import isValidToken from '@/auth/guards/isValidToken.guard';
import { Routes } from '@angular/router';

export const passwords: Routes = [
  {
    path: 'passwords',
    loadComponent: () => import('./pages/passwords-page/passwords-page'),
    canActivate: [isValidToken],

  }
];
