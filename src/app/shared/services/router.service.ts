import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router);

  public navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
