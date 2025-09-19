import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment.development';
import { catchError, delay, map, Observable, tap, throwError } from 'rxjs';
import { Password, CreatePassword, CreatePasswordApiResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  private http = inject(HttpClient);

  private passwords$ = signal<Password[]>([]);
  public passwords = computed(() => this.passwords$());
  public setPasswords(passwords: Password[]) {
    this.passwords$.set(passwords);
  }

  public getAllPasswords(userId: string): Observable<Password[]> {
    return this.http.post<Password[]>(`${environment.API_URL}/passwords/getAll`, { userId }).pipe(
      delay(1000),
      tap((response) => {
        this.setPasswords(response);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public requestPasswordCode() {
    // TODO IMPLEMENTAR ESTO; QUE DEVUELVA UN CODIGO VALIDO
  }

  public getPassword(idPassword: string): Observable<Password> {
    return this.http
      .post<Password>(`${environment.API_URL}/passwords/getPassword`, {
        idPassword,
      })
      .pipe(
        delay(1000),
        catchError((error) => throwError(() => error))
      );
  }

  public createPassword(password: CreatePassword): Observable<Password[]> {
    return this.http
      .post<CreatePasswordApiResponse>(`${environment.API_URL}/passwords/create`, password)
      .pipe(
        delay(1000),
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
          this.setPasswords(password);
          return password;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  // Método para limpiar al hacer logout
  public clearPasswords(): void {
    this.setPasswords([]);
  }
}
