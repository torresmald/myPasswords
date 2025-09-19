import { Password } from '@/passwords/interfaces/password.interface';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { ModalService } from '@/shared/services/modal.service';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-password',
  imports: [],
  templateUrl: './password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent {
  public password = input.required<Password>();
  private modalService = inject(ModalService);

  public showPassword() {
    this.modalService.openViewPasswordModal(this.password().id);
  }
}
