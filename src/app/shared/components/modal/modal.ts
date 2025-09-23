import { ModalService } from '@/shared/services/modal.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { CreatePassword, RequestPassword, ViewPassword } from '@/passwords/interfaces';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { CategoryService } from '@/category/services/category.service';
import { CreateCategory } from '@/category/interfaces';
import { AuthService } from '@/auth/services/auth.service';
import { AuthFormComponent } from '@/shared/components/form/form';
import { FormConfig, FormDataConfig, SelectOption } from '@/auth/interfaces';
import {
  CREATE_PASSWORD_CONFIG,
  CREATE_CATEGORY_CONFIG,
  VIEW_PASSWORD_CONFIG,
} from '@/shared/configs/form-configs';
import { LoadingService } from '@/shared/services/loading.service';
import { AlertService } from '@/shared/services/alert.service';

@Component({
  selector: 'app-modal',
  imports: [AuthFormComponent],
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  private modalService = inject(ModalService);
  private passwordsService = inject(PasswordsService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private alertService = inject(AlertService);

  public shouldResetForm = this.passwordsService.shouldResetForm;

  // Modal state
  public getModal = computed(() => this.modalService.modal());
  public getTitle = computed(() => this.modalService.title());
  public getModalType = computed(() => this.modalService.modalType());

  // Form configuration signals
  private formConfig$ = signal<FormConfig | null>(null);
  public shouldResetForm$ = signal(false);
  public checked = signal(false);
  private userId = computed(() => this.authService.getUser()?.id!);
  public password = this.modalService.password;

  private modalEffect = effect(() => {
    if (this.getModalType() === 'add-password') {
      this.loadCategoriesForPasswordForm();
    }

    // Load password data for view modal
    if (this.getModalType() === 'view-password') {
      this.getPasswordId();
    }
  });

  public getFormConfig = computed(() => {
    const modalType = this.getModalType();
    let config: FormConfig | null = null;

    switch (modalType) {
      case 'add-password':
        config = CREATE_PASSWORD_CONFIG;
        break;
      case 'add-category':
        config = CREATE_CATEGORY_CONFIG;
        break;
      case 'view-password':
        config = VIEW_PASSWORD_CONFIG;
        break;
      default:
        config = CREATE_PASSWORD_CONFIG;
    }

    return config;
  });

  public getSubmitButtonText = computed(() => {
    const modalType = this.getModalType();
    switch (modalType) {
      case 'add-password':
        return 'Add Password';
      case 'add-category':
        return 'Add Category';
      case 'view-password':
        return 'Request Code';
      default:
        return 'Submit';
    }
  });

  private getPasswordId() {
    const passwordId = this.modalService.passwordId();
    this.handleRequestPasswordCode(passwordId);
  }

  private loadCategoriesForPasswordForm(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryService.setCategories(categories);

      const categoryOptions: SelectOption[] = categories.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      // Update form config with categories
      const currentConfig = this.getFormConfig();
      if (currentConfig) {
        const updatedConfig = { ...currentConfig };
        const categoryField = updatedConfig.fields.find((field) => field.name === 'idCategory');
        if (categoryField && categoryField.type === 'select') {
          categoryField.options = categoryOptions;
          this.formConfig$.set(updatedConfig);
        }
      }
    });
  }

  public closeModal() {
    this.modalService.showModal(false);
    this.shouldResetForm$.set(true);
  }

  public onFormSubmit(formData: FormDataConfig) {
    const modalType = this.getModalType();

    switch (modalType) {
      case 'add-password':
        this.handlePasswordCreation(formData as CreatePassword);
        break;
      case 'add-category':
        this.handleCategoryCreation(formData as CreateCategory);
        break;
      case 'view-password':
        this.handleViewPassword(formData as ViewPassword);
        break;
    }
  }

  private handlePasswordCreation(password: CreatePassword) {
    password.userId = this.userId();
    this.loadingService.showLoading(true);

    this.passwordsService.createPassword(password).subscribe({
      next: (response) => {
        this.passwordsService.setErrors('Created New Password', 'success');
        this.modalService.showModal(false);
      },
      error: (error) => {
        this.passwordsService.setErrors(error);
      },
      complete: () => {
        this.loadingService.showLoading(false);
      },
    });
  }

  private handleCategoryCreation(category: CreateCategory) {
    category.userId = this.userId();
    this.loadingService.showLoading(true);

    const formData = this.categoryService.prepareFormData(category);
    this.categoryService.createCategory(formData).subscribe({
      next: (response) => {
        this.passwordsService.setErrors('Category Created');
        this.modalService.showModal(false);
      },
      error: (error) => {
        this.passwordsService.setErrors(error);
      },
      complete: () => {
        this.loadingService.showLoading(false);
      },
    });
  }

  private handleRequestPasswordCode(passwordId: string) {
    this.loadingService.showLoading(true);
    try {
      this.passwordsService.requestPasswordCode(passwordId).subscribe({
        next: (response) => this.passwordsService.setErrors(response.message, 'success'),
        error: (error) => this.passwordsService.setErrors(error),
        complete: () => this.loadingService.showLoading(false),
      });
    } catch (error) {
      console.log(error);
    }
  }

  private handleViewPassword(data: ViewPassword) {
    const passwordId = this.modalService.passwordId();
    data.idPassword = passwordId;
    this.loadingService.showLoading(true);
    try {
      this.passwordsService.getPassword(data).subscribe({
        next: (response) => {
          this.passwordsService.setErrors('View password', 'success');
          this.modalService.openViewPasswordModalData(response);
        },
        error: (error) => this.passwordsService.setErrors(error),
        complete: () => this.loadingService.showLoading(false),
      });
    } catch (error) {
      console.log(error);
    }
  }

  public onSelectImage(event: Event) {
    this.categoryService.onSelectImage(event);
  }

  public async copyPassword(text: string) {
    await navigator.clipboard.writeText(text);
    this.alertService.setAlertMessage('Password copied to clipboad');
    this.alertService.setAlertType('success');
    this.alertService.showAlert(true);
  }
}
