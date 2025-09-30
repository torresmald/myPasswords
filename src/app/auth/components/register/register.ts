import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFormComponent } from '../../../shared/components/form/form';
import { REGISTER_CONFIG } from '@/shared/configs/form-configs';
import { AuthService } from '@/auth/services/auth.service';
import { UserRegister } from '@/auth/interfaces/user.interface';
import { RouterService } from '@/shared/services/router.service';
import { ImageService } from '@/shared/services/image.service';
import { LoadingService } from '@/shared/services/loading.service';
import { FormDataConfig } from '@/shared/interfaces/form-config.interface';

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
  private loadingService = inject(LoadingService);
  private imageService = inject(ImageService);
  public checked = signal(false);
  public checkedWhatsapp = signal(false);

  public shouldResetForm = this.authService.shouldResetForm;

  onRegister(formData: FormDataConfig) {
    const { repeatPassword, ...userData } = formData;
    const user: UserRegister = userData as UserRegister;
    const formDataToSend = this.authService.prepareFormData(user);
    try {
      this.loadingService.showLoading(true);

      this.authService.register(formDataToSend).subscribe({
        next: (response) => {
          this.routerService.navigateTo('/login');
          this.authService.setErrors(
            'User Registered. Check you mail account for an activacion mail',
            'success'
          );
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
