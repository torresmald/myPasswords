import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFormComponent } from '../../../shared/components/form/form';
import { LOGIN_CONFIG } from '@/shared/configs/form-configs';
import { FormDataConfig } from '@auth/interfaces/form-config.interface';
import { AuthService } from '@/auth/services/auth.service';
import { RouterService } from '@/shared/services/router.service';
import { AlertService } from '@/shared/services/alert.service';
import { User } from '@/auth/interfaces/user.interface';

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

  public shouldResetForm = signal(false);

  onLogin(userData: FormDataConfig) {
    this.shouldResetForm.set(false)
    const user: User = userData as User;
    try {
      this.authService.login(user).subscribe({
        next: (response) => {
          this.routerService.navigateTo('/passwords');
        },
        error: (response) => {
          this.setErrors(response);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  private setErrors(message: string = 'User not logged') {
    this.alertService.setAlertMessage(message);
    this.alertService.showAlert(true);
    this.alertService.setAlertType('error');
    this.shouldResetForm.set(true);
  }
}
