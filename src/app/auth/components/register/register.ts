import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFormComponent } from '../form/form';
import { REGISTER_CONFIG } from '@auth/configs/form-configs';
import { FormData } from '@auth/interfaces/form-config.interface';

@Component({
  selector: 'app-register',
  imports: [RouterLink, AuthFormComponent],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  formConfig = REGISTER_CONFIG;

  onRegister(formData: FormData) {
    console.log('Register data:', formData);
    // Aquí iría la lógica de registro
  }
}
