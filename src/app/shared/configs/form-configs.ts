import { Validators } from '@angular/forms';
import { FormConfig } from '@/auth/interfaces/form-config.interface';
import { FormHelpers } from '@auth/helpers/form.helpers';

export const LOGIN_CONFIG: FormConfig = {
  fields: [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      autocomplete: 'email',
      validators: [Validators.required, Validators.pattern(FormHelpers.emailPattern)],
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'current-password',
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(FormHelpers.passwordPattern),
      ],
    },
  ],
};

export const REGISTER_CONFIG: FormConfig = {
  fields: [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      autocomplete: 'email',
      validators: [Validators.required, Validators.pattern(FormHelpers.emailPattern)],
    },
    {
      name: 'name',
      type: 'text',
      placeholder: 'Username',
      autocomplete: 'name',
      validators: [Validators.required, Validators.minLength(3)],
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'new-password',
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(FormHelpers.passwordPattern),
      ],
    },
    {
      name: 'repeatPassword',
      type: 'password',
      placeholder: 'Repeat Password',
      autocomplete: 'new-password',
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(FormHelpers.passwordPattern),
      ],
    },
  ],
  validators: FormHelpers.isField1DifferentField2('password', 'repeatPassword'),
};

export const CREATE_PASSWORD_CONFIG: FormConfig = {
  fields: [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Name',
      autocomplete: 'name',
      validators: [Validators.required, Validators.minLength(3)],
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'password',
      validators: [Validators.required],
    },
    {
      name: 'idCategory',
      type: 'select',
      placeholder: 'Select category',
      autocomplete: 'category',
      validators: [Validators.required],
      options: [],
    },
  ],
};

export const CREATE_CATEGORY_CONFIG: FormConfig = {
  fields: [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Name',
      autocomplete: 'name',
      validators: [Validators.required, Validators.minLength(3)],
    },
  ],
};

export const VIEW_PASSWORD_CONFIG: FormConfig = {
  fields: [
    {
      name: 'otp',
      type: 'text',
      placeholder: 'Enter Received Code',
      autocomplete: 'off',
      validators: [Validators.required],
    },
  ],
};

export const FORGOT_PASSWORD: FormConfig = {
  fields: [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      autocomplete: 'true',
      validators: [Validators.required, Validators.pattern(FormHelpers.emailPattern)],
    },
  ],
};

export const FORGOT_PASSWORD_RESET: FormConfig = {
  fields: [
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'new-password',
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(FormHelpers.passwordPattern),
      ],
    },
    {
      name: 'repeatPassword',
      type: 'password',
      placeholder: 'Repeat Password',
      autocomplete: 'new-password',
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(FormHelpers.passwordPattern),
      ],
    },
  ],
};

export const UPDATE_DATA: FormConfig = {
  fields: [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Name',
      autocomplete: 'name',
      validators: [Validators.minLength(3)],
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'new-password',
      validators: [Validators.minLength(10), Validators.pattern(FormHelpers.passwordPattern)],
    },
    {
      name: 'repeatPassword',
      type: 'password',
      placeholder: 'Repeat Password',
      autocomplete: 'new-password',
      validators: [Validators.minLength(10), Validators.pattern(FormHelpers.passwordPattern)],
    },
  ],
  validators: FormHelpers.isField1DifferentField2('password', 'repeatPassword'),
};
