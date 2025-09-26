import { PasswordComponent } from '@/passwords/components/password/password';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { IconComponent } from '@/shared/components/svg/icon';
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { ModalService } from '@/shared/services/modal.service';
import { RouterService } from '@/shared/services/router.service';
import { SharedPageComponent } from '@/shared/pages/shared-page/shared-page';

@Component({
  selector: 'app-passwords-page',
  imports: [PasswordComponent, SharedPageComponent, IconComponent],
  templateUrl: './passwords-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PasswordsPageComponent {
  private passwordsService = inject(PasswordsService);
  private modalService = inject(ModalService);
  private routerService = inject(RouterService);

  public passwords = this.passwordsService.passwords;
  public modal = computed(() => this.modalService.modal());

  public addPassword() {
    this.modalService.openAddPasswordModal();
  }

  public manageCategories() {
    this.routerService.navigateTo('/categories');
  }
}
