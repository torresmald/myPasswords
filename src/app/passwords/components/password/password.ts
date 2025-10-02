import { Password } from '@/passwords/interfaces/password.interface';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { ModalService } from '@/shared/services/modal.service';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { IconComponent } from '@/shared/components/svg/icon';
import { AuthService } from '@/auth/services/auth.service';

@Component({
  selector: 'app-password',
  imports: [IconComponent],
  templateUrl: './password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent {
  private modalService = inject(ModalService);
  private authService = inject(AuthService);
  public password = input.required<Password>();
  protected isAdminUser = this.authService.isAdminUser;

  protected showPassword(method: 'email' | 'whatsapp' = 'email') {
    this.modalService.openViewPasswordModal(this.password(), method);
  }

  protected deletePassword() {
    this.modalService.openDeletePassword(this.password());
  }

  protected updatePassword() {
    this.modalService.openUpdateDataPasswordModal(this.password());
  }

  protected getCategoryBackgroundImage(categoryImage?: string): string {
    if (categoryImage) {
      return `url(${categoryImage})`;
    }
    const defaultImage =
      'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp';
    return `url(${defaultImage})`;
  }
}
