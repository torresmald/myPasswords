import { Password } from '@/passwords/interfaces/password.interface';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { ModalService } from '@/shared/services/modal.service';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { IconComponent } from "@/shared/components/svg/icon";

@Component({
  selector: 'app-password',
  imports: [IconComponent],
  templateUrl: './password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent {
  public password = input.required<Password>();
  private modalService = inject(ModalService);

  public showPassword() {
    this.modalService.openViewPasswordModal(this.password().id);
  }

  public deletePassword() {
    this.modalService.openDeletePassword(this.password().id);
  }

  public getCategoryBackgroundImage(categoryImage?: string): string {
    if (categoryImage) {
      return `url(${categoryImage})`;
    }
    const defaultImage =
      'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp';
    return `url(${defaultImage})`;
  }
}
