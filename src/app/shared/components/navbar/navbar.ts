import { AuthService } from '@/auth/services/auth.service';
import { ModalService } from '@/shared/services/modal.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private routerService = inject(RouterService);

  public logout() {
    this.authService.logout();
  }

  private modalService = inject(ModalService);

  public addPassword() {
    this.modalService.openAddPasswordModal();
  }

  public addCategory() {
    this.modalService.openAddCategoryModal();
  }

  public updateData() {
    this.routerService.navigateTo('/auth/update');
  }
}
