import { AuthService } from '@/auth/services/auth.service';
import { PasswordComponent } from '@/passwords/components/password/password';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { NavbarComponent } from '@/shared/components/navbar/navbar';
import { ChangeDetectionStrategy, Component, inject, computed, effect } from '@angular/core';
import { ModalComponent } from '@/shared/components/modal/modal';
import { ModalService } from '@/shared/services/modal.service';

@Component({
  selector: 'app-passwords-page',
  imports: [PasswordComponent, NavbarComponent, ModalComponent],
  templateUrl: './passwords-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PasswordsPageComponent {
  private passwordsService = inject(PasswordsService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  // Computed para verificar si el usuario está listo
  private isUserReady = computed(() => {
    return this.authService.getUser() && this.authService.getAuthStatus() === 'authenticated';
  });

  public passwords = computed(() => this.passwordsService.passwords());
  public modal = computed(() => this.modalService.modal());

  public passwordsEffect = effect(() => {
    if (this.isUserReady()) {
      const user = this.authService.getUser();
      if (user?.id) {
        this.passwordsService.getAllPasswords(user.id).subscribe();
      }
    }
  });

  public addPassword() {
    this.modalService.openAddPasswordModal();
  }

  public addCategory() {
    this.modalService.openAddCategoryModal();
  }
}
