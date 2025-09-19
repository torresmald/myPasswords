import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment.development';
import { delay, Observable } from 'rxjs';
import { Category } from '../interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  private categories$ = signal<Category[]>([]);
  public categories = computed(() => this.categories$());
  public setCategories(categories: Category[]) {
    this.categories$.set(categories);
  }

  private imageCategoryBase64$ = signal<File | null>(null);
  public imageCategoryBase64 = computed(() => this.imageCategoryBase64$());

  public setImageCategoryBase64(file: File) {
    this.imageCategoryBase64$.set(file);
  }

  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.API_URL}/categories/getAll`).pipe(delay(1000));
  }

  public createCategory(formData: FormData): Observable<Category> {
    return this.http
      .post<Category>(`${environment.API_URL}/categories/create`, formData)
      .pipe(delay(1000));
  }
}
