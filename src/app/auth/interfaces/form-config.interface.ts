import { ValidatorFn } from '@angular/forms';

export interface FormConfig {
  fields: FormFieldConfig[];
  validators?: ValidatorFn | ValidatorFn[];
}
export interface FormFieldConfig {
  name: string;
  type: 'email' | 'password' | 'text';
  placeholder: string;
  validators: ValidatorFn[];
  autocomplete?: string;
}


export interface FormData {
  [key: string]: any;
}
