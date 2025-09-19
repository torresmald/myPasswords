import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading$ = signal(false);
  public loading = computed(() => this.loading$());

  public showLoading(condition: boolean) {
    this.loading$.set(condition);
  }
}
