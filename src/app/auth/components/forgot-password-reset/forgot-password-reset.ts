import {  ForgotPasswordReset, FormDataConfig } from '@/auth/interfaces';
import { AuthService } from '@/auth/services/auth.service';
import { AuthFormComponent } from '@/shared/components/form/form';
import { FORGOT_PASSWORD_RESET } from '@/shared/configs/form-configs';
import { AlertService } from '@/shared/services/alert.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './forgot-password-reset.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForgotPasswordResetComponent {
  formConfig = FORGOT_PASSWORD_RESET;
  private authService = inject(AuthService);
  private routerService = inject(RouterService);
  alertService = inject(AlertService);

  public token = input.required<string>();
  public shouldResetForm = signal(false);

  onForgotPasswordReset(userData: FormDataConfig) {
    this.shouldResetForm.set(false);
    const forgotPasswordConfig = userData as ForgotPasswordReset;
    forgotPasswordConfig.token = this.token();
    try {
      this.authService.forgotPasswordReset(forgotPasswordConfig).subscribe({
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

  private setErrors(message: string = 'Forgot Password Reset Error') {
    this.alertService.setAlertMessage(message);
    this.alertService.showAlert(true);
    this.alertService.setAlertType('error');
    this.shouldResetForm.set(true);
  }
}
