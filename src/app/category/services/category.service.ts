import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, delay, map, Observable, tap, throwError } from 'rxjs';
import {
  Category,
  CategoryApiResponse,
  CreateCategory,
  PaginationData,
  UpdateCategory,
} from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '@/shared/services/image.service';
import { PaginationService } from '@/shared/services/pagination.service';
import { LoadingService } from '@/shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private imageService = inject(ImageService);
  private paginationService = inject(PaginationService);
  private loadingService = inject(LoadingService);

  private categories$ = signal<Category[]>([]);
  public categories = this.categories$.asReadonly();

  public getAllCategories(page: number = 1, limit: number = 10): Observable<CategoryApiResponse> {
    if (page < 0) {
      page = 1;
    }
    this.loadingService.showLoading(true);
    return this.http
      .get<CategoryApiResponse>(
        `${environment.API_URL}/categories/getAll?page=${page}&limit=${limit}`
      )
      .pipe(
        tap((response) => {
          this.categories$.set(response.data);
          this.paginationService.setPaginationDataCategory(response.pagination);
          this.loadingService.showLoading(false);
        }),
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
            oldCategories.map((cat) => (cat.id === response.category.id ? response.category : cat))
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
