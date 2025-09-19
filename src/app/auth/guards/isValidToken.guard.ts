import { AuthService } from '@/auth/services/auth.service';
import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';

const isValidToken: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUrl = state.url;

  const token = authService.getToken();

  // Si no hay token
  if (!token) {
    // Si está intentando acceder a passwords, redirigir a login
    if (currentUrl.includes('/passwords')) {
      return router.navigate(['/auth/login']);
    }
    // Si está en auth, permitir acceso
    return true;
  }

  // Si hay token, verificar que sea válido
  try {
    const user = await firstValueFrom(authService.isValidToken());

    // Si el token es válido y el usuario está validado
    if (user && user.isValidUser) {
      // Si está en auth y token es válido, redirigir a passwords
      if (currentUrl.includes('/auth')) {
        return router.navigate(['/passwords']);
      }
      // Si está en passwords y token es válido, permitir acceso
      return true;
    }

    // Token inválido o usuario no validado
    authService.logout(); // Limpiar token inválido

    // Si está en passwords, redirigir a login
    if (currentUrl.includes('/passwords')) {
      return router.navigate(['/auth/login']);
    }

    // Si está en auth, permitir acceso
    return true;
  } catch (error) {
    authService.logout(); // Limpiar token corrupto

    if (currentUrl.includes('/passwords')) {
      return router.navigate(['/auth/login']);
    }

    // Si está en auth, permitir acceso
    return true;
  }
};

export default isValidToken;
