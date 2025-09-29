import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading$ = signal(true);
  public loading = this.loading$.asReadonly()

  public showLoading(condition: boolean) {
    this.loading$.set(condition);
  }
}
