import { ForgotPasswordReset } from '@/auth/interfaces';
import { AuthService } from '@/auth/services/auth.service';
import { AuthFormComponent } from '@/shared/components/form/form';
import { FORGOT_PASSWORD_RESET } from '@/shared/configs/form-configs';
import { FormDataConfig } from '@/shared/interfaces/form-config.interface';
import { LoadingService } from '@/shared/services/loading.service';
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
  private loadingService = inject(LoadingService);

  public token = input.required<string>();
  public shouldResetForm = this.authService.shouldResetForm

  onForgotPasswordReset(userData: FormDataConfig) {
    this.shouldResetForm.set(false);
    const forgotPasswordConfig = userData as ForgotPasswordReset;
    forgotPasswordConfig.token = this.token();
    this.loadingService.showLoading(true);
    try {
      this.authService.forgotPasswordReset(forgotPasswordConfig).subscribe({
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
