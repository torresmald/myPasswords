import { AuthService } from '@/auth/services/auth.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {
  private authService = inject(AuthService);
  private routerService = inject(RouterService);

  public authStatus = computed(() => this.authService.getAuthStatus());
  public user = computed(() => this.authService.getUser());

  public navigateToAuth() {
    this.routerService.navigateTo('/auth/login');
  }

  public navigateToPasswords() {
    this.routerService.navigateTo('/passwords');
  }
}
