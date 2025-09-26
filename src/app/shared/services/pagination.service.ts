import { PaginationData } from '@/category/interfaces/category.interface';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private route = inject(ActivatedRoute);

  public page = toSignal(
    this.route.queryParams.pipe(
      map((query) => query['page'] ?? 1),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  private paginationDataCategoy$ = signal<PaginationData | null>(null);
  public paginationDataCategoy = this.paginationDataCategoy$.asReadonly();

  public setPaginationDataCategory(paginationData: PaginationData) {
    this.paginationDataCategoy$.set(paginationData);
  }

  private paginationDataPassword$ = signal<PaginationData | null>(null);
  public paginationDataPassword = this.paginationDataPassword$.asReadonly();

  public setPaginationDataPassword(paginationData: PaginationData) {
    this.paginationDataPassword$.set(paginationData);
  }
}
