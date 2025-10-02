import { AuthService } from '@/auth/services/auth.service';
import { LoadingService } from '@/shared/services/loading.service';
import { inject } from '@angular/core';
import { CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// Cache para evitar validaciones innecesarias
let lastValidatedToken: string | null = null;
let isTokenValid = false;

const isValidToken: CanActivateFn = async (_, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const router = inject(Router);

  const currentUrl = state.url;
  const isHomeRoute = currentUrl.includes('/home');
  const isPasswordsRoute = currentUrl.includes('/passwords');
  const isCategoriesRoute = currentUrl.includes('/categories');
  const isUpdateRoute = currentUrl.includes('/auth/update');
  const isLoginRegisterRoute =
    currentUrl.includes('/auth/login') || currentUrl.includes('/auth/register');
  const token = authService.getToken();

  // Helper functions for cleaner navigation logic
  const navigateToHome = () => router.navigate(['/home']);
  const navigateToPasswords = () => router.navigate(['/passwords']);

  // No token case - no need for loading since it's instant
  if (!token) {
    // Reset cache when no token
    lastValidatedToken = null;
    isTokenValid = false;

    // Without token: only allow public routes, block protected routes
    if (isPasswordsRoute || isCategoriesRoute || isUpdateRoute) {
      return navigateToHome();
    }
    return true; // Allow public auth routes and home
  }

  // Check if user is already logged and token hasn't changed
  if (authService.isUserLogged() && token === lastValidatedToken && isTokenValid) {
    return true; // Skip validation if token hasn't changed and was previously valid
  }

  // Detect token change - if token is different from last validated, reset cache
  if (token && lastValidatedToken && token !== lastValidatedToken) {
    lastValidatedToken = null;
    isTokenValid = false;
  }

  // Token exists and either changed or needs validation - validate it (show loading during async validation)
  loadingService.showLoading(true);

  try {
    const user = await firstValueFrom(authService.isValidToken());
    const isValidUser = user?.isValidUser;

    if (isValidUser) {
      // Cache successful validation
      lastValidatedToken = token;
      isTokenValid = true;

      // Home: always allow access (after token validation for UI state)
      if (isHomeRoute) {
        return true;
      }

      // Login/Register: redirect to passwords when authenticated
      if (isLoginRegisterRoute) {
        return navigateToPasswords();
      }

      return true; // Allow passwords, update, and other protected routes
    }

    // Invalid token: cleanup cache and apply no-token logic
    lastValidatedToken = null;
    isTokenValid = false;
    authService.logout();

    // Home: always accessible even with invalid token
    if (isHomeRoute) {
      return true;
    }

    return isPasswordsRoute || isUpdateRoute ? navigateToHome() : true;
  } catch (error) {
    loadingService.showLoading(false);

    // Token validation failed: cleanup cache and apply no-token logic
    lastValidatedToken = null;
    isTokenValid = false;
    authService.logout();

    // Home: always accessible even after token validation error
    if (isHomeRoute) {
      return true;
    }

    // For ALL protected routes, redirect to home when token validation fails
    if (isPasswordsRoute || isCategoriesRoute || isUpdateRoute) {
      return navigateToHome();
    }

    return true; // Allow auth routes
  } finally {
    // Always hide loading when validation completes
    loadingService.showLoading(false);
  }
};

export default isValidToken;
