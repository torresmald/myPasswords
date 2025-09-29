import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

import { catchError, map, Observable, tap, throwError } from 'rxjs';
import {
  Password,
  CreatePassword,
  CreatePasswordApiResponse,
  ViewPassword,
  UpdatePassword,
  PasswordApiResponse,
} from '../interfaces';
import { AlertService } from '@/shared/services/alert.service';
import { LoadingService } from '@/shared/services/loading.service';
import { PaginationData } from '@/category/interfaces';
import { PaginationService } from '@/shared/services/pagination.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  constructor() {
    this.getAllPasswords().subscribe();
  }
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  private paginationService = inject(PaginationService);

  private passwords$ = signal<Password[]>([]);
  public passwords = this.passwords$.asReadonly();
  public paginationData = this.paginationService.paginationDataPassword;
  public shouldResetForm = signal(false);

  public getAllPasswords(page: number = 1, limit: number = 10): Observable<PasswordApiResponse> {
    if (page < 0) {
      page = 1;
    }
    this.loadingService.showLoading(true);
    return this.http
      .get<PasswordApiResponse>(
        `${environment.API_URL}/passwords/getAll?page=${page}&limit=${limit}`
      )
      .pipe(
        tap((response) => {
          this.passwords$.set(response.data);
          this.paginationService.setPaginationDataPassword(response.pagination);
          this.loadingService.showLoading(false);
        }),
        catchError((error) => throwError(() => error))
      );
  }

  public requestPasswordCode(idPassword: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${environment.API_URL}/passwords/requestPasswordCode`, {
        idPassword,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public getPassword(data: ViewPassword): Observable<Password> {
    return this.http
      .post<Password>(`${environment.API_URL}/passwords/getPassword`, data)
      .pipe(catchError((error) => throwError(() => error)));
  }

  public createPassword(password: CreatePassword): Observable<Password[]> {
    return this.http
      .post<CreatePasswordApiResponse>(`${environment.API_URL}/passwords/create`, password)
      .pipe(
        map((response) => {
          const password: Password[] = [
            ...this.passwords(),
            {
              id: response.id,
              name: response.name,
              category: response.category,
              user: response.category.user,
            },
          ];
          this.passwords$.set(password);
          return password;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  public updatePassword(
    password: UpdatePassword
  ): Observable<{ message: string; password: Password }> {
    return this.http
      .put<{ message: string; password: Password }>(
        `${environment.API_URL}/passwords/update`,
        password
      )
      .pipe(
        tap((response) => {
          this.passwords$.update((oldPasswords) =>
            oldPasswords.map((pass) =>
              pass.id === response.password.id ? response.password : pass
            )
          );
        }),
        catchError((error) => throwError(() => error))
      );
  }

  public deletePassword(
    passwordId: string
  ): Observable<{ message: string; passwords: Password[] }> {
    return this.http
      .delete<{ message: string; passwords: Password[] }>(
        `${environment.API_URL}/passwords/delete/${passwordId}`
      )
      .pipe(
        tap((response) => this.passwords$.set(response.passwords)),
        catchError((error) => throwError(() => error))
      );
  }

  public setErrors(message: string, type: 'success' | 'error' = 'error') {
    this.alertService.setAlertMessage(message);
    this.alertService.showAlert(true);
    this.alertService.setAlertType(type);
    this.shouldResetForm.set(true);
    this.loadingService.showLoading(false);
  }
}
