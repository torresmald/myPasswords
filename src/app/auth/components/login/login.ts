import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFormComponent } from '../form/form';
import { LOGIN_CONFIG } from '@auth/configs/form-configs';
import { FormData } from '@auth/interfaces/form-config.interface';

@Component({
  selector: 'app-login',
  imports: [RouterLink, AuthFormComponent],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  formConfig = LOGIN_CONFIG;

  onLogin(formData: FormData) {
    console.log('Login data:', formData);
    // Aquí iría la lógica de autenticación
  }
}
