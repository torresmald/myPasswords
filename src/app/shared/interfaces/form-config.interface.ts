import { ValidatorFn } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormConfig {
  fields: FormFieldConfig[];
  validators?: ValidatorFn | ValidatorFn[];
}

export interface FormFieldConfig {
  name: string;
  type: 'email' | 'password' | 'text' | 'select' | 'checkbox' | 'file';
  placeholder?: string;
  validators?: ValidatorFn[];
  autocomplete?: string;
  options?: SelectOption[];
}

export interface FormDataConfig {
  [key: string]: any;
}
