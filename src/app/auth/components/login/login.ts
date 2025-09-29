import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFormComponent } from '../../../shared/components/form/form';
import { LOGIN_CONFIG } from '@/shared/configs/form-configs';
import { AuthService } from '@/auth/services/auth.service';
import { RouterService } from '@/shared/services/router.service';
import { AlertService } from '@/shared/services/alert.service';
import { User } from '@/auth/interfaces/user.interface';
import { LoadingService } from '@/shared/services/loading.service';
import { FormDataConfig } from '@/shared/interfaces/form-config.interface';

@Component({
  selector: 'app-login',
  imports: [RouterLink, AuthFormComponent],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  formConfig = LOGIN_CONFIG;
  private authService = inject(AuthService);
  private routerService = inject(RouterService);
  alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  public shouldResetForm = this.authService.shouldResetForm;

  onLogin(userData: FormDataConfig) {
    this.authService.shouldResetForm.set(false);
    const user: User = userData as User;
    this.loadingService.showLoading(true);
    try {
      this.authService.login(user).subscribe({
        next: (response) => {
          this.routerService.navigateTo('/passwords');
          this.authService.setErrors('User Logged', 'success');
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
