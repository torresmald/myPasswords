import { FormHelpers } from '@auth/helpers/form.helpers';
import { ChangeDetectionStrategy, Component, inject, Input, Output, EventEmitter, OnInit, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormConfig, FormData } from '@auth/interfaces/form-config.interface';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent implements OnInit {


  public config = input.required<FormConfig>();
  public title = input.required<string>();
  public formSubmit = output<FormData>()

  private fb = inject(FormBuilder);

  public myForm!: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    const formControls: { [key: string]: any } = {};

    this.config().fields.forEach(field => {
      formControls[field.name] = ['', field.validators];
    });

    this.myForm = this.fb.group(formControls, {
      validators: this.config().validators || null
    });
  }

  public isValidField(fieldName: string): boolean | null {
    return FormHelpers.isValidField(this.myForm, fieldName);
  }

  public getFieldError(fieldName: string): string | null {
    return FormHelpers.getFieldError(this.myForm, fieldName);
  }

  public hasFormError(errorName: string): boolean {
    return FormHelpers.hasFormError(this.myForm, errorName);
  }

  public getFormError(errorName: string): string | null {
    return FormHelpers.getFormError(this.myForm, errorName);
  }

  public getFieldConfig(fieldName: string) {
    return this.config().fields.find(field => field.name === fieldName);
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      this.formSubmit.emit(this.myForm.value);
    }
  }
}
