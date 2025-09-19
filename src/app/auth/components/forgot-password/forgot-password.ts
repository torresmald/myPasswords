import { FormDataConfig, User } from '@/auth/interfaces';
import { AuthService } from '@/auth/services/auth.service';
import { AuthFormComponent } from '@/shared/components/form/form';
import { FORGOT_PASSWORD } from '@/shared/configs/form-configs';
import { AlertService } from '@/shared/services/alert.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './forgot-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForgotPasswordComponent {
  formConfig = FORGOT_PASSWORD;
  private authService = inject(AuthService);
  private routerService = inject(RouterService);
  alertService = inject(AlertService);

  public shouldResetForm = signal(false);

  onForgotPassword(userData: FormDataConfig) {
    this.shouldResetForm.set(false);
    const email: User = userData as User;
    const emailToForgot = email.email;
    try {
      this.authService.forgotPassword(emailToForgot).subscribe({
        next: (response) => {
          this.alertService.setAlertMessage(response.message);
          this.alertService.setAlertType('success');
          this.alertService.showAlert(true);
          setTimeout(() => {
            this.routerService.navigateTo('/auth/login');
          }, 2000);
        },
        error: (response) => {
          this.setErrors(response);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  private setErrors(message: string = 'Forgot Password Error') {
    this.alertService.setAlertMessage(message);
    this.alertService.showAlert(true);
    this.alertService.setAlertType('error');
    this.shouldResetForm.set(true);
  }
}
