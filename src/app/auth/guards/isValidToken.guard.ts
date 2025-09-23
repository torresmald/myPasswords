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
  const isPasswordsRoute = currentUrl.includes('/passwords');
  const isUpdateRoute = currentUrl.includes('/auth/update');
  const isPublicAuthRoute = currentUrl.includes('/auth/login') ||
                           currentUrl.includes('/auth/register');
  const token = authService.getToken();

  // Helper functions for cleaner navigation logic
  const navigateToLogin = () => router.navigate(['/auth/login']);
  const navigateToPasswords = () => router.navigate(['/passwords']);

  // No token case - no need for loading since it's instant
  if (!token) {
    // Without token: only allow public routes, block protected routes
    if (isPasswordsRoute || isUpdateRoute) {
      return navigateToLogin();
    }
    return true; // Allow public auth routes (login, register, forgot-password, etc.)
  }

  // Token exists - validate it (show loading during async validation)
  loadingService.showLoading(true);

  try {
    const user = await firstValueFrom(authService.isValidToken());
    const isValidUser = user?.isValidUser;

    if (isValidUser) {
      // Valid token: redirect public auth routes to passwords, allow protected routes
      if (isPublicAuthRoute) {
        return navigateToPasswords(); // Redirect login/register to passwords
      }
      return true; // Allow passwords, update, and other protected routes
    }

    // Invalid token: cleanup and apply no-token logic
    authService.logout();
    return (isPasswordsRoute || isUpdateRoute) ? navigateToLogin() : true;

  } catch (error) {
    // Token validation failed: cleanup and apply no-token logic
    authService.logout();
    return (isPasswordsRoute || isUpdateRoute) ? navigateToLogin() : true;
  } finally {
    // Always hide loading when validation completes
    loadingService.showLoading(false);
  }
};

export default isValidToken;
