import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import {
  AuthStatus,
  ForgotPassword,
  ForgotPasswordReset,
  UpdateUser,
  User,
  UserApi,
  UserRegister,
} from '../interfaces';
import { RouterService } from '@/shared/services/router.service';
import { ImageService } from '@/shared/services/image.service';
import { AlertService } from '@/shared/services/alert.service';
import { LoadingService } from '@/shared/services/loading.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private routerService = inject(RouterService);
  private imageService = inject(ImageService);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  public shouldResetForm = signal(false);
  private authStatus = signal<AuthStatus>('checking');
  private user = signal<UserApi | null>(null);
  private token = signal<string | null>(localStorage.getItem('myPasswordToken'));
  public getToken = this.token.asReadonly();
  public getUser = this.user.asReadonly();

  public getAuthStatus = computed<AuthStatus>(() => {
    if (this.authStatus() === 'checking') return 'checking';
    if (this.user()?.isValidUser && this.authStatus() === 'authenticated') return 'authenticated';
    return 'not-authenticated';
  });

  public register(user: FormData): Observable<UserApi> {
    return this.http.post<UserApi>(`${environment.API_URL}/auth/register`, user).pipe(
      tap((user) => this.setResponses('authenticated', user)),
      catchError((error: Error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public login(user: User): Observable<UserApi> {
    return this.http.post<UserApi>(`${environment.API_URL}/auth/login`, user).pipe(
      tap((user) => this.setResponses('authenticated', user)),
      catchError((error: any) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public isValidToken(): Observable<UserApi> {
    const token = localStorage.getItem('myPasswordToken');
    if (!token) {
      this.logout();
      return of();
    }
    return this.http.get<UserApi>(`${environment.API_URL}/auth/check-token`).pipe(
      tap((user) => {
        this.setResponses('authenticated', user);
      }),
      catchError((error: any) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public confirmAccount(token: string): Observable<UserApi> {
    return this.http
      .post<UserApi>(`${environment.API_URL}/auth/confirm-account`, { token })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public forgotPassword(email: string): Observable<ForgotPassword> {
    return this.http
      .post<ForgotPassword>(`${environment.API_URL}/auth/forgot-password`, { email })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public forgotPasswordReset(
    forgotPasswordConfig: ForgotPasswordReset
  ): Observable<ForgotPassword> {
    return this.http
      .put<ForgotPassword>(
        `${environment.API_URL}/auth/forgot-password-reset`,
        forgotPasswordConfig
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  public updateUserData(updateUserData: FormData): Observable<ForgotPassword> {
    return this.http
      .put<ForgotPassword>(`${environment.API_URL}/auth/update`, updateUserData)
      .pipe(catchError((error) => throwError(() => error)));
  }

  public setResponses(authStatus: AuthStatus, user: UserApi): UserApi {
    this.authStatus.set(authStatus);
    this.user.set(user);
    this.token.set(user.token);
    localStorage.setItem('myPasswordToken', user.token);
    return user;
  }

  public logout() {
    this.authStatus.set('not-authenticated');
    this.user.set(null);
    this.token.set(null);
    localStorage.removeItem('myPasswordToken');
    this.routerService.navigateTo('/home');
  }

  public prepareFormData(userData: UserRegister | UpdateUser) {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('password', userData.password);
    if ('email' in userData) {
      formData.append('email', userData.email);
    } else {
      formData.append('token', userData.token);
    }
    if (this.imageService.imageCategoryBase64() != null) {
      const imageBase64 = this.imageService.imageCategoryBase64()!;
      formData.append('image', imageBase64);
      if ('email' in userData) {
        (userData as UserRegister).image = imageBase64;
      } else {
        (userData as UpdateUser).image = imageBase64;
      }
    }

    return formData;
  }

  public setErrors(message: string, type: 'success' | 'error' = 'error') {
    this.alertService.setAlertMessage(message);
    this.alertService.showAlert(true);
    this.alertService.setAlertType(type);
    this.shouldResetForm.set(true);
    this.loadingService.showLoading(false);
  }
}
