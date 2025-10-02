import { HttpRequest, HttpEvent, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '@/shared/services/loading.service';
import { AuthService } from '../services/auth.service';

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const loadingService = inject(LoadingService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Error desconocido';

      // Manejar 401 - Token inválido o expirado
      if (error.status === 401) {
        // Limpiar localStorage y redirigir a home
        localStorage.removeItem('myPasswordToken');
        loadingService.showLoading(false);
        authService.logout()
        router.navigate(['/home']);
        errorMessage = error.error?.message || 'Token validation failed';
      } else {
        // Priorizar mensaje del backend
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          // Mensajes por código de estado
          switch (error.status) {
            case 400:
              errorMessage = 'Solicitud inválida';
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.statusText}`;
          }
        }
      }

      console.error('HTTP Error:', error);
      return throwError(() => errorMessage);
    })
  );
}
