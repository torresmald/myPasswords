import { Validators } from '@angular/forms';
import { FormConfig } from '@auth/interfaces/form-config.interface';
import { FormHelpers } from '@auth/helpers/form.helpers';

export const LOGIN_CONFIG: FormConfig = {
  fields: [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      autocomplete: 'email',
      validators: [
        Validators.required,
        Validators.pattern(FormHelpers.emailPattern)
      ]
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'current-password',
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(FormHelpers.passwordPattern)
      ]
    }
  ]
};

export const REGISTER_CONFIG: FormConfig = {
  fields: [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      autocomplete: 'email',
      validators: [
        Validators.required,
        Validators.pattern(FormHelpers.emailPattern)
      ]
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'new-password',
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(FormHelpers.passwordPattern)
      ]
    },
    {
      name: 'repeatPassword',
      type: 'password',
      placeholder: 'Repeat Password',
      autocomplete: 'new-password',
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(FormHelpers.passwordPattern)
      ]
    }
  ],
  validators: FormHelpers.isField1DifferentField2('password', 'repeatPassword')
};
