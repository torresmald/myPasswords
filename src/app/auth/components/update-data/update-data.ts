import { UpdateUser } from '@/auth/interfaces';
import { AuthService } from '@/auth/services/auth.service';
import { AuthFormComponent } from '@/shared/components/form/form';
import { UPDATE_DATA } from '@/shared/configs/form-configs';
import { FormDataConfig } from '@/shared/interfaces/form-config.interface';
import { ImageService } from '@/shared/services/image.service';
import { LoadingService } from '@/shared/services/loading.service';
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
  private loadingService = inject(LoadingService);
  private imageService = inject(ImageService);
  public checked = signal(false);

  public shouldResetForm = this.authService.shouldResetForm;

  onUpdateData(userData: FormDataConfig) {
    this.shouldResetForm.set(false);
    const data: UpdateUser = userData as UpdateUser;
    data.token = this.authService.getToken()!;
    const formData = this.authService.prepareFormDataUpdate(data);
    this.loadingService.showLoading(true);
    try {
      this.authService.updateUserData(formData).subscribe({
        next: (response) => {
          this.authService.setErrors(response.message, 'success');
          this.routerService.navigateTo('/passwords');
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

  public onSelectImage(event: Event) {
    this.imageService.onSelectImage(event);
  }
}
