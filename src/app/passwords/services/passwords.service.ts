import { HttpClient } from '@angular/common/http';
import {  inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

import { catchError, lastValueFrom, map, Observable, tap, throwError } from 'rxjs';
import {
  Password,
  CreatePasswordApiResponse,
  ViewPassword,
  UpdatePassword,
} from '../interfaces';
import { AlertService } from '@/shared/services/alert.service';
import { LoadingService } from '@/shared/services/loading.service';
import { PaginationData } from '@/category/interfaces';
import { PaginationService } from '@/shared/services/pagination.service';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private paginationService = inject(PaginationService);
  private queryClient = inject(QueryClient);

  private passwords$ = signal<Password[]>([]);
  public passwords = this.passwords$.asReadonly();
  public setPasswords(passwords: Password[]) {
    this.passwords$.set(passwords);
  }

  public paginationData = this.paginationService.paginationDataPassword;

  public requestPasswordCode(idPassword: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${environment.API_URL}/passwords/requestPasswordCode`, {
        idPassword,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public requestPasswordCodeWhatsapp(idPassword: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${environment.API_URL}/passwords/requestPasswordCodeWhatsapp`, {
        idPassword,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public getPassword(data: ViewPassword): Observable<Password> {
    return this.http
      .post<Password>(`${environment.API_URL}/passwords/getPassword`, data)
      .pipe(catchError((error) => throwError(() => error)));
  }

  private async createPassword(password: FormData): Promise<Password[]> {
    this.loadingService.showLoading(true);

    const response = await lastValueFrom(
      this.http
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
        )
    );
    this.loadingService.showLoading(false);

    return response;
  }

  public createPasswordMutation = injectMutation(() => ({
    mutationFn: (formData: FormData) => this.createPassword(formData),
    onSuccess: () => {
      // Invalidar las queries de categorías para que se refresquen
      this.queryClient.invalidateQueries({ queryKey: ['passwords'] });
    },
  }));

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



  private async getAllPasswords(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Password[]; pagination: PaginationData }> {
    if (page < 0) page = 1;
    this.loadingService.showLoading(true);

    const response = await lastValueFrom(
      this.http
        .get<{ data: Password[]; pagination: PaginationData }>(
          `${environment.API_URL}/passwords/getAll?page=${page}&limit=${limit}`
        )
        .pipe(catchError((error) => throwError(() => error)))
    );
    this.loadingService.showLoading(false);

    return response;
  }

  // Query hook que acepta parámetros de paginación
  public passwordsQuery = injectQuery(() => ({
    queryKey: ['passwords', this.paginationService.page()],
    queryFn: () => this.getAllPasswords(this.paginationService.page()),
    staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
    gcTime: 10 * 60 * 1000, // Mantener en cache por 10 minutos
  }));
}
