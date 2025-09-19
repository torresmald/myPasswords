import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFormComponent } from '../../../shared/components/form/form';
import { REGISTER_CONFIG } from '@/shared/configs/form-configs';
import { FormDataConfig } from '@auth/interfaces/form-config.interface';
import { AuthService } from '@/auth/services/auth.service';
import { User } from '@/auth/interfaces/user.interface';
import { RouterService } from '@/shared/services/router.service';
import { AlertService } from '@/shared/services/alert.service';
import { MailService } from '@/mail/services/mail.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, AuthFormComponent],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  formConfig = REGISTER_CONFIG;
  private authService = inject(AuthService);
  private routerService = inject(RouterService);
  private alertService = inject(AlertService);

  public shouldResetForm = signal(false);

  onRegister(formData: FormDataConfig) {
    const { repeatPassword, ...userData } = formData;
    const user: User = userData as User;
    try {
      this.authService.register(user).subscribe({
        next: (response) => {
          this.routerService.navigateTo('/login');
        },
        error: (response) => {
          this.setErrors(response);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  private setErrors(message: string) {
    this.alertService.setAlertMessage(message);
    this.alertService.showAlert(true);
    this.alertService.setAlertType('error');
    this.shouldResetForm.set(true);
  }
}
