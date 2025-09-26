import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Category, CreateCategory, UpdateCategory } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '@/shared/services/image.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor() {
    this.getAllCategories().subscribe();
  }
  private http = inject(HttpClient);
  private imageService = inject(ImageService);

  private categories$ = signal<Category[]>([]);
  public categories = this.categories$.asReadonly();

  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.API_URL}/categories/getAll`).pipe(
      tap((response) => this.categories$.set(response)),
      catchError((error) => throwError(() => error))
    );
  }

  public createCategory(formData: FormData): Observable<Category[]> {
    return this.http.post<Category>(`${environment.API_URL}/categories/create`, formData).pipe(
      map((response) => {
        const category: Category[] = [
          ...this.categories(),
          {
            id: response.id,
            name: response.name,
            user: response.user,
          },
        ];
        this.categories$.set(category);
        return category;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deleteCategory(
    categoryId: string
  ): Observable<{ message: string; categories: Category[] }> {
    return this.http
      .delete<{ message: string; categories: Category[] }>(
        `${environment.API_URL}/categories/delete/${categoryId}`
      )
      .pipe(
        tap((response) => this.categories$.set(response.categories)),
        catchError((error) => throwError(() => error))
      );
  }

  public updateCategory(formData: FormData): Observable<{ message: string; category: Category }> {
    return this.http
      .put<{ message: string; category: Category }>(
        `${environment.API_URL}/categories/update`,
        formData
      )
      .pipe(
        tap((response) => {
          this.categories$.update((oldCategories) =>
            oldCategories.map(cat =>
              cat.id === response.category.id ? response.category : cat
            )
          );
        }),
        catchError((error) => throwError(() => error))
      );
  }

  public prepareFormData(category: CreateCategory | UpdateCategory) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('userId', category.userId);
    if ('categoryId' in category) {
      formData.append('categoryId', category.categoryId);
    }
    if (this.imageService.imageCategoryBase64() != null) {
      category.image = this.imageService.imageCategoryBase64()!;
      formData.append('image', category.image);
    }
    return formData;
  }

  public async onSelectImage(event: Event) {
    this.imageService.onSelectImage(event);
  }
}
