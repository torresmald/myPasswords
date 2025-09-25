import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Category, CreateCategory } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '@/shared/services/image.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private imageService = inject(ImageService);

  private categories$ = signal<Category[]>([]);
  public categories = computed(() => this.categories$());
  public setCategories(categories: Category[]) {
    this.categories$.set(categories);
  }

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
        this.setCategories(category);
        return category;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public deleteCategory(categoryId: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${environment.API_URL}/categories/delete/${categoryId}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  public prepareFormData(category: CreateCategory) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('userId', category.userId);
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
