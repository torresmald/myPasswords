import { User } from '@/auth/interfaces';
import { AuthService } from '@/auth/services/auth.service';
import { AuthFormComponent } from '@/shared/components/form/form';
import { FORGOT_PASSWORD } from '@/shared/configs/form-configs';
import { FormDataConfig } from '@/shared/interfaces/form-config.interface';
import { AlertService } from '@/shared/services/alert.service';
import { LoadingService } from '@/shared/services/loading.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  private loadingService = inject(LoadingService);

  public shouldResetForm = this.authService.shouldResetForm;

  onForgotPassword(userData: FormDataConfig) {
    this.shouldResetForm.set(false);
    const email: User = userData as User;
    const emailToForgot = email.email;
    this.loadingService.showLoading(true);

    try {
      this.authService.forgotPassword(emailToForgot).subscribe({
        next: (response) => {
          this.authService.setErrors(response.message, 'success');
          this.routerService.navigateTo('/auth/login');
        },
        error: (response) => {
          this.authService.setErrors(response);
        },
        complete: () => {
          this.loadingService.showLoading(false);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
