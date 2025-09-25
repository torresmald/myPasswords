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

  public user = this.authService.getUser;

  public logout() {
    this.authService.logout();
  }

  private modalService = inject(ModalService);

  public addPassword() {
    this.modalService.openAddPasswordModal();
  }

  public manageCategories() {
    this.routerService.navigateTo('/categories');

    //this.modalService.openAddCategoryModal();
  }

  public managePasswords() {
    this.routerService.navigateTo('/passwords');
  }

  public updateData() {
    this.routerService.navigateTo('/auth/update');
  }
}
