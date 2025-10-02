import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, throwError, lastValueFrom } from 'rxjs';
import {
  Category,
  PaginationData,
} from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '@/shared/services/image.service';
import { PaginationService } from '@/shared/services/pagination.service';
import { LoadingService } from '@/shared/services/loading.service';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private imageService = inject(ImageService);
  private paginationService = inject(PaginationService);
  private loadingService = inject(LoadingService);
  private queryClient = inject(QueryClient);

  private categories$ = signal<Category[]>([]);
  public categories = this.categories$.asReadonly();
  public setCategories(categories: Category[]) {
    this.categories$.set(categories);
  }

  // Función privada para crear categoría - usada por la mutation
  private async createCategory(formData: FormData): Promise<Category> {
    this.loadingService.showLoading(true);

    const response = await lastValueFrom(
      this.http
        .post<Category>(`${environment.API_URL}/categories/create`, formData)
        .pipe(catchError((error) => throwError(() => error)))
    );

    this.loadingService.showLoading(false);

    return response;
  }

  // Mutation para crear categoría
  public createCategoryMutation = injectMutation(() => ({
    mutationFn: (formData: FormData) => this.createCategory(formData),
    onSuccess: () => {
      // Invalidar las queries de categorías para que se refresquen
      this.queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  }));

  // Función privada para eliminar categoría - usada por la mutation
  private async deleteCategory(
    categoryId: string
  ): Promise<{ message: string; categories: Category[] }> {
    this.loadingService.showLoading(true);

    const response = await lastValueFrom(
      this.http
        .delete<{ message: string; categories: Category[] }>(
          `${environment.API_URL}/categories/delete/${categoryId}`
        )
        .pipe(catchError((error) => throwError(() => error)))
    );
    this.loadingService.showLoading(false);
    return response;
  }

  // Mutation para eliminar categoría con optimistic updates
  public deleteCategoryMutation = injectMutation(() => ({
    mutationFn: (categoryId: string) => this.deleteCategory(categoryId),

    // 🚀 OPTIMISTIC UPDATE - Actualiza la UI ANTES de que termine la petición
    onMutate: async (deletedId: string) => {
      // Cancelar queries pendientes que podrían sobrescribir nuestro update optimista
      await this.queryClient.cancelQueries({ queryKey: ['categories'] });

      // Snapshot del estado anterior por si necesitamos revertir
      const previousCategories = this.queryClient.getQueryData([
        'categories',
        this.paginationService.page(),
      ]);

      // Actualizar optimísticamente - remover la categoría de la UI inmediatamente
      this.queryClient.setQueryData(['categories', this.paginationService.page()], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((cat: Category) => cat.id !== deletedId),
        };
      });

      // También actualizar el signal para compatibilidad
      this.categories$.update((categories) => categories.filter((cat) => cat.id !== deletedId));

      return { previousCategories, deletedId };
    },

    // Si la petición es exitosa, invalidar queries para sincronizar con el servidor
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['categories'] });
    },

    // 🔄 Si falla, revertir los cambios optimistas
    onError: (err, deletedId, context) => {
      if (context?.previousCategories) {
        this.queryClient.setQueryData(
          ['categories', this.paginationService.page()],
          context.previousCategories
        );
        // Revertir el signal también
        const prevData = context.previousCategories as any;
        if (prevData?.data) {
          this.categories$.set(prevData.data);
        }
      }
    },
  }));

  // Función privada para actualizar categoría - usada por la mutation
  private async updateCategory(
    formData: FormData
  ): Promise<{ message: string; category: Category }> {
    this.loadingService.showLoading(true);

    const response = await lastValueFrom(
      this.http
        .put<{ message: string; category: Category }>(
          `${environment.API_URL}/categories/update`,
          formData
        )
        .pipe(catchError((error) => throwError(() => error)))
    );
    this.loadingService.showLoading(false);
    return response;
  }

  // Mutation para actualizar categoría con optimistic updates
  public updateCategoryMutation = injectMutation(() => ({
    mutationFn: (formData: FormData) => this.updateCategory(formData),

    // 🚀 OPTIMISTIC UPDATE - Actualiza la UI ANTES de que termine la petición
    onMutate: async (formData: FormData) => {
      // Obtener el categoryId del FormData para identificar qué categoría actualizar
      const categoryId = formData.get('categoryId') as string;
      const categoryName = formData.get('name') as string;

      if (!categoryId) return;

      // Cancelar queries pendientes
      await this.queryClient.cancelQueries({ queryKey: ['categories'] });

      // Snapshot del estado anterior
      const previousCategories = this.queryClient.getQueryData([
        'categories',
        this.paginationService.page(),
      ]);

      // Actualizar optimísticamente - cambiar la categoría en la UI inmediatamente
      this.queryClient.setQueryData(['categories', this.paginationService.page()], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((cat: Category) =>
            cat.id === categoryId ? { ...cat, name: categoryName } : cat
          ),
        };
      });

      // También actualizar el signal para compatibilidad
      this.categories$.update((categories) =>
        categories.map((cat) => (cat.id === categoryId ? { ...cat, name: categoryName } : cat))
      );

      return { previousCategories, categoryId };
    },

    // Si la petición es exitosa, invalidar queries para sincronizar con el servidor
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['categories'] });
    },

    // 🔄 Si falla, revertir los cambios optimistas
    onError: (err, formData, context) => {
      if (context?.previousCategories) {
        this.queryClient.setQueryData(
          ['categories', this.paginationService.page()],
          context.previousCategories
        );
        // Revertir el signal también
        const prevData = context.previousCategories as any;
        if (prevData?.data) {
          this.categories$.set(prevData.data);
        }
      }
    },
  }));



  public async onSelectImage(event: Event) {
    this.imageService.onSelectImage(event);
  }

  private async getAllCategories(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Category[]; pagination: PaginationData }> {
    if (page < 0) page = 1;
    this.loadingService.showLoading(true);

    const response = await lastValueFrom(
      this.http
        .get<{ data: Category[]; pagination: PaginationData }>(
          `${environment.API_URL}/categories/getAll?page=${page}&limit=${limit}`
        )
        .pipe(catchError((error) => throwError(() => error)))
    );

    this.loadingService.showLoading(false);
    this.categories$.set(response.data);

    return response;
  }

  public categoriesQuery = injectQuery(() => ({
    queryKey: ['categories', this.paginationService.page()],
    queryFn: () => this.getAllCategories(this.paginationService.page()),
    staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
    gcTime: 10 * 60 * 1000, // Mantener en cache por 10 minutos
  }));
}
