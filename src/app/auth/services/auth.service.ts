import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import {
  AuthStatus,
  ForgotPassword,
  ForgotPasswordReset,
  UpdateUser,
  UserLogin,
  UserApi,
  UserRegister,
} from '../interfaces';
import { PasswordsService } from '@/passwords/services/passwords.service';
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
  private passwordsService = inject(PasswordsService);
  private routerService = inject(RouterService);
  private imageService = inject(ImageService);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  public shouldResetForm = signal(false);
  private authStatus = signal<AuthStatus>('checking');
  private user = signal<UserApi | null>(null);
  private token = signal<string | null>(localStorage.getItem('token'));
  public getToken = computed<string | null>(() => this.token());
  public getUser = computed<UserApi | null>(() => this.user());

  public getAuthStatus = computed<AuthStatus>(() => {
    if (this.authStatus() === 'checking') return 'checking';
    if (this.user()?.isValidUser && this.authStatus() === 'authenticated') return 'authenticated';
    return 'not-authenticated';
  });

  public register(user: FormData): Observable<UserApi> {
    return this.http.post<UserApi>(`${environment.API_URL}/auth/register`, user).pipe(
      delay(1000),
      map((user) => this.setResponses('authenticated', user)),
      catchError((error: Error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public login(user: UserLogin): Observable<UserApi> {
    return this.http.post<UserApi>(`${environment.API_URL}/auth/login`, user).pipe(
      delay(1000),
      map((user) => {
        return this.setResponses('authenticated', user);
      }),
      catchError((error: any) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public isValidToken(): Observable<UserApi> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of();
    }
    return this.http.get<UserApi>(`${environment.API_URL}/auth/check-token`).pipe(
      delay(1000),
      tap((user) => this.setResponses('authenticated', user)),
      map((user) => user),
      catchError((error: any) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public confirmAccount(token: string): Observable<UserApi> {
    return this.http.post<UserApi>(`${environment.API_URL}/auth/confirm-account`, { token }).pipe(
      delay(1000),
      catchError((error) => throwError(() => error))
    );
  }

  public forgotPassword(email: string): Observable<ForgotPassword> {
    return this.http
      .post<ForgotPassword>(`${environment.API_URL}/auth/forgot-password`, { email })
      .pipe(
        delay(1000),
        catchError((error) => throwError(() => error))
      );
  }

  public forgotPasswordReset(
    forgotPasswordConfig: ForgotPasswordReset
  ): Observable<ForgotPassword> {
    return this.http
      .put<ForgotPassword>(
        `${environment.API_URL}/auth/forgot-password-reset`,
        forgotPasswordConfig
      )
      .pipe(
        delay(1000),
        catchError((error) => throwError(() => error))
      );
  }

  public updateUserData(updateUserData: FormData): Observable<ForgotPassword> {
    return this.http.put<ForgotPassword>(`${environment.API_URL}/auth/update`, updateUserData).pipe(
      delay(1000),
      catchError((error) => throwError(() => error))
    );
  }

  public setResponses(authStatus: AuthStatus, user: UserApi): UserApi {
    this.authStatus.set(authStatus);
    this.user.set(user);
    this.token.set(user.token);
    localStorage.setItem('token', user.token);
    return user;
  }

  public logout() {
    this.authStatus.set('not-authenticated');
    this.user.set(null);
    this.token.set(null);
    localStorage.removeItem('token');
    this.passwordsService.clearPasswords();
    this.routerService.navigateTo('/auth/login');
  }

  public prepareFormData(user: UserRegister) {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('password', user.password);
    if (this.imageService.imageCategoryBase64() != null) {
      user.image = this.imageService.imageCategoryBase64()!;
      formData.append('image', user.image);
    }
    return formData;
  }

  public prepareFormDataUpdate(userUpdated: UpdateUser) {
    const formData = new FormData();
    formData.append('name', userUpdated.name);
    formData.append('password', userUpdated.password);
    formData.append('token', userUpdated.token);
    if (this.imageService.imageCategoryBase64() != null) {
      userUpdated.image = this.imageService.imageCategoryBase64()!;
      formData.append('image', userUpdated.image);
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
