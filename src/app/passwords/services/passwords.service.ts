import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

import { catchError, lastValueFrom, map, Observable, tap, throwError } from 'rxjs';
import { Password, CreatePasswordApiResponse, ViewPassword, UpdatePassword } from '../interfaces';
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

  private async updatePassword(
    password: UpdatePassword
  ): Promise<{ message: string; password: Password }> {
    this.loadingService.showLoading(true)
    const response = await lastValueFrom(
      this.http
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
        )
    );
    this.loadingService.showLoading(false)

    return response;
  }

  public updatePasswordMutation = injectMutation(() => ({
    mutationFn: (data: UpdatePassword) => this.updatePassword(data),

    // 🚀 OPTIMISTIC UPDATE - Actualiza la UI ANTES de que termine la petición
    onMutate: async (data: UpdatePassword) => {
      const passwordId = data.categoryId;
      const passwordName = data.name!;

      if (!passwordId) return;

      // Cancelar queries pendientes
      await this.queryClient.cancelQueries({ queryKey: ['passwords'] });

      // Snapshot del estado anterior
      const previousPasswords = this.queryClient.getQueryData([
        'passwords',
        this.paginationService.page(),
      ]);

      // Actualizar optimísticamente - cambiar la categoría en la UI inmediatamente
      this.queryClient.setQueryData(['passwords', this.paginationService.page()], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((pwd: Password) =>
            pwd.id === passwordId ? { ...pwd, name: passwordName } : pwd
          ),
        };
      });

      // También actualizar el signal para compatibilidad
      this.passwords$.update((passwords) =>
        passwords.map((pwd) => (pwd.id === passwordId ? { ...pwd, name: passwordName } : pwd))
      );

      return { previousPasswords, passwordId };
    },

    // Si la petición es exitosa, invalidar queries para sincronizar con el servidor
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['passwords'] });
    },

    // 🔄 Si falla, revertir los cambios optimistas
    onError: (err, formData, context) => {
      if (context?.previousPasswords) {
        this.queryClient.setQueryData(
          ['passwords', this.paginationService.page()],
          context.previousPasswords
        );
        // Revertir el signal también
        const prevData = context.previousPasswords as any;
        if (prevData?.data) {
          this.passwords$.set(prevData.data);
        }
      }
    },
  }));

  private async deletePassword(
    passwordId: string
  ): Promise<{ message: string; passwords: Password[] }> {
    this.loadingService.showLoading(true);

    const response = await lastValueFrom(
      this.http
        .delete<{ message: string; passwords: Password[] }>(
          `${environment.API_URL}/passwords/delete/${passwordId}`
        )
        .pipe(
          tap((response) => this.passwords$.set(response.passwords)),
          catchError((error) => throwError(() => error))
        )
    );
    this.loadingService.showLoading(false);

    return response;
  }

  public deletePasswordMutation = injectMutation(() => ({
    mutationFn: (passwordId: string) => this.deletePassword(passwordId),

    // 🚀 OPTIMISTIC UPDATE - Actualiza la UI ANTES de que termine la petición
    onMutate: async (deletedId: string) => {
      // Cancelar queries pendientes que podrían sobrescribir nuestro update optimista
      await this.queryClient.cancelQueries({ queryKey: ['passwords'] });

      // Snapshot del estado anterior por si necesitamos revertir
      const previousPasswords = this.queryClient.getQueryData([
        'passwords',
        this.paginationService.page(),
      ]);

      // Actualizar optimísticamente - remover la categoría de la UI inmediatamente
      this.queryClient.setQueryData(['passwords', this.paginationService.page()], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((pwd: Password) => pwd.id !== deletedId),
        };
      });

      // También actualizar el signal para compatibilidad
      this.passwords$.update((passwords) => passwords.filter((pwd) => pwd.id !== deletedId));

      return { previousPasswords, deletedId };
    },

    // Si la petición es exitosa, invalidar queries para sincronizar con el servidor
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['passwords'] });
    },

    // 🔄 Si falla, revertir los cambios optimistas
    onError: (err, deletedId, context) => {
      if (context?.previousPasswords) {
        this.queryClient.setQueryData(
          ['passwords', this.paginationService.page()],
          context.previousPasswords
        );
        // Revertir el signal también
        const prevData = context.previousPasswords as any;
        if (prevData?.data) {
          this.passwords$.set(prevData.data);
        }
      }
    },
  }));

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
