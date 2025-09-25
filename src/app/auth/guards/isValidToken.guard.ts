import { AuthService } from '@/auth/services/auth.service';
import { LoadingService } from '@/shared/services/loading.service';
import { inject } from '@angular/core';
import { CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const isValidToken: CanActivateFn = async (_, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const router = inject(Router);

  const currentUrl = state.url;
  const isHomeRoute = currentUrl.includes('/home');
  const isPasswordsRoute = currentUrl.includes('/passwords');
  const isUpdateRoute = currentUrl.includes('/auth/update');
  const isLoginRegisterRoute =
    currentUrl.includes('/auth/login') || currentUrl.includes('/auth/register');
  const token = authService.getToken();

  // Helper functions for cleaner navigation logic
  const navigateToHome = () => router.navigate(['/home']);
  const navigateToPasswords = () => router.navigate(['/passwords']);

  // No token case - no need for loading since it's instant
  if (!token) {
    // Without token: only allow public routes, block protected routes
    if (isPasswordsRoute || isUpdateRoute) {
      return navigateToHome();
    }
    return true; // Allow public auth routes and home
  }

  // Token exists - validate it (show loading during async validation)
  loadingService.showLoading(true);

  try {
    const user = await firstValueFrom(authService.isValidToken());
    const isValidUser = user?.isValidUser;

    // Home: always allow access (after token validation for UI state)
    if (isHomeRoute) {
      return true; // Allows both authenticated and non-authenticated users
    }

    if (isValidUser) {
      // Login/Register: redirect to passwords when authenticated
      if (isLoginRegisterRoute) {
        return navigateToPasswords();
      }

      return true; // Allow passwords, update, and other protected routes
    }

    // Invalid token: cleanup and apply no-token logic
    authService.logout();

    // Home: always accessible even with invalid token
    if (isHomeRoute) {
      return true;
    }

    return isPasswordsRoute || isUpdateRoute ? navigateToHome() : true;
  } catch (error) {
    // Token validation failed: cleanup and apply no-token logic
    authService.logout();

    // Home: always accessible even after token validation error
    if (isHomeRoute) {
      return true;
    }

    return isPasswordsRoute || isUpdateRoute ? navigateToHome() : true;
  } finally {
    // Always hide loading when validation completes
    loadingService.showLoading(false);
  }
};

export default isValidToken;
