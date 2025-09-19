import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormHelpers {
  static errorHandle(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'El campo es requerido';
        case 'minlength':
          return `El campo debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `El campo debe ser mininmo ${errors['min'].min}`;
        case 'pattern':
          return `El campo no tiene un formato valido`;
        case 'passwordNotEqual':
          return 'Los password no son iguales';
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]?.errors) return null;
    const errors = form.controls[fieldName].errors ?? {};
    return this.errorHandle(errors);
  }

  static hasFormError(form: FormGroup, errorName: string): boolean {
    return !!form.errors?.[errorName] && form.touched;
  }

  static getFormError(form: FormGroup, errorName: string): string | null {
    if (!form.errors?.[errorName]) return null;
    const errors = { [errorName]: form.errors[errorName] };
    return this.errorHandle(errors);
  }

  static isField1DifferentField2(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const value1 = formGroup.get(field1)?.value;
      const value2 = formGroup.get(field2)?.value;
      return value1 === value2 ? null : { passwordNotEqual: true };
    };
  }

  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$';
}
