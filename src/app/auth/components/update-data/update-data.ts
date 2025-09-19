import { FormDataConfig, UpdateUser } from '@/auth/interfaces';
import { AuthService } from '@/auth/services/auth.service';
import { AuthFormComponent } from '@/shared/components/form/form';
import { UPDATE_DATA } from '@/shared/configs/form-configs';
import { AlertService } from '@/shared/services/alert.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-update-data',
  imports: [RouterLink, AuthFormComponent],
  templateUrl: './update-data.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UpdateDataComponent {
  formConfig = UPDATE_DATA;
  private authService = inject(AuthService);
  private routerService = inject(RouterService);
  alertService = inject(AlertService);

  public shouldResetForm = signal(false);

  onUpdateData(userData: FormDataConfig) {
    console.log('Envio');

    this.shouldResetForm.set(false);
    const data: UpdateUser = userData as UpdateUser;
    data.token = this.authService.getToken()!;
    try {
      this.authService.updateUserData(data).subscribe({
        next: (response) => {
          this.alertService.setAlertMessage(response.message);
          this.alertService.setAlertType('success');
          this.alertService.showAlert(true);
          setTimeout(() => {
            this.routerService.navigateTo('/passwords');
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

  private setErrors(message: string = 'Update User Data Error') {
    this.alertService.setAlertMessage(message);
    this.alertService.showAlert(true);
    this.alertService.setAlertType('error');
    this.shouldResetForm.set(true);
  }
}
