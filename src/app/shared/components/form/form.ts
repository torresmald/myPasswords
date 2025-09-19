import { FormHelpers } from '@auth/helpers/form.helpers';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  input,
  output,
  effect,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormConfig, FormDataConfig } from '@auth/interfaces/form-config.interface';
import { ModalService } from '@/shared/services/modal.service';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent implements OnInit {
  private modalService = inject(ModalService);
  public config = input.required<FormConfig>();
  public title = input.required<string>();
  public submitButtonText = input.required<string>();
  public isAuthForm = input.required<boolean>();

  public shouldResetForm = input.required<boolean>();

  public effectForm = effect(() => {
    if (this.shouldResetForm()) {
      this.createForm();
    }
  });

  public formSubmit = output<FormDataConfig>();

  private fb = inject(FormBuilder);

  public myForm!: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    const formControls: { [key: string]: any } = {};

    this.config().fields.forEach((field) => {
      formControls[field.name] = ['', field.validators];
    });

    this.myForm = this.fb.group(formControls, {
      validators: this.config().validators || null,
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
    return this.config().fields.find((field) => field.name === fieldName);
  }

  public isFormValid(): boolean {
    const fields = this.config().fields;
    return (
      this.myForm.valid &&
      fields.some((field) => {
        const control = this.myForm.get(field.name);
        return control && control.value && control.value.toString().trim() !== '';
      })
    );
  }

  public onSubmit() {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      this.formSubmit.emit(this.myForm.value);
    }
  }

  public onCancel() {
    this.modalService.showModal(false);
  }
}
