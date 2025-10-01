import { ModalService } from '@/shared/services/modal.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { CreatePassword, UpdatePassword, ViewPassword } from '@/passwords/interfaces';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { CategoryService } from '@/category/services/category.service';
import { CreateCategory, UpdateCategory } from '@/category/interfaces';
import { AuthService } from '@/auth/services/auth.service';
import { AuthFormComponent } from '@/shared/components/form/form';
import {
  CREATE_PASSWORD_CONFIG,
  CREATE_CATEGORY_CONFIG,
  VIEW_PASSWORD_CONFIG,
  DELETE_CONFIG,
  UPDATE_DATA_CATEGORY,
  UPDATE_DATA_PASSWORD,
} from '@/shared/configs/form-configs';
import { LoadingService } from '@/shared/services/loading.service';
import { AlertService } from '@/shared/services/alert.service';
import {
  FormConfig,
  FormDataConfig,
  SelectOption,
} from '@/shared/interfaces/form-config.interface';

@Component({
  selector: 'app-modal',
  imports: [AuthFormComponent],
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ` .modal { position: absolute !important } `,
})
export class ModalComponent {
  private modalService = inject(ModalService);
  private passwordsService = inject(PasswordsService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private alertService = inject(AlertService);

  public shouldResetForm$ = signal(false);
  public shouldResetForm = this.passwordsService.shouldResetForm;

  // Modal state
  public getModal = this.modalService.modal;
  public getTitle = this.modalService.title;
  public getModalType = this.modalService.modalType;

  // Form configuration signals
  private formConfig$ = signal<FormConfig | null>(null);
  public checked = signal(false);
  private userId = computed(() => this.authService.getUser()?.id!);
  public isAdminUser = this.authService.isAdminUser;
  public password = this.modalService.password;
  public passwordId = this.modalService.passwordId;
  public categoryId = this.modalService.categoryId;

  private modalEffect = effect(() => {
    if (this.getModalType() === 'add-password' || this.getModalType() === 'update-data-password') {
      this.loadCategoriesForPasswordForm();
    }

    if (
      this.getModalType() === 'view-password' &&
      this.isAdminUser() &&
      this.modalService.method() === 'whatsapp'
    ) {
      this.handleRequestPasswordCodeWhatsapp(this.passwordId());
    }

    // Load password data for view modal
    if (this.getModalType() === 'view-password' && !this.isAdminUser()) {
      this.handleRequestPasswordCode(this.passwordId());
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
      case 'delete-password':
      case 'delete-category':
        config = DELETE_CONFIG;
        break;
      case 'update-data-category':
        config = UPDATE_DATA_CATEGORY;
        break;
      case 'update-data-password':
        config = UPDATE_DATA_PASSWORD;
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
      case 'delete-password':
      case 'delete-category':
        return 'Delete';
      case 'update-data-category':
      case 'update-data-password':
        return 'Update';
      default:
        return 'Submit';
    }
  });

  public getSubmitButtonColor = computed(() => {
    const modalType = this.getModalType();
    switch (modalType) {
      case 'delete-password':
      case 'delete-category':
        return 'btn-error';
      default:
        return 'btn-primary';
    }
  });

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
      case 'delete-password':
        this.handleDeletePassword();
        break;
      case 'delete-category':
        this.handleDeleteCategory();
        break;
      case 'update-data-category':
        this.handleUpdateDataCategory(formData as UpdateCategory);
        break;
      case 'update-data-password':
        this.handleUpdateDataPassword(formData as UpdatePassword);
        break;
    }
  }

  private loadCategoriesForPasswordForm(): void {
    const categoryOptions: SelectOption[] = this.categoryService.categories().map((category) => ({
      value: category.id,
      label: category.name,
    }));
    // Update form config with categories
    const currentConfig = this.getFormConfig();
    if (currentConfig) {
      const updatedConfig = { ...currentConfig };
      const categoryField = updatedConfig.fields.find((field) => field.name === 'categoryId');
      if (categoryField && categoryField.type === 'select') {
        categoryField.options = categoryOptions;
        this.formConfig$.set(updatedConfig);
      }
    }
  }

  public closeModal() {
    this.modalService.showModal(false);
    this.shouldResetForm$.set(true);
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
        this.passwordsService.setErrors('Category Created', 'success');
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

  private handleRequestPasswordCodeWhatsapp(passwordId: string) {
    this.loadingService.showLoading(true);
    try {
      this.passwordsService.requestPasswordCodeWhatsapp(passwordId).subscribe({
        next: (response) => this.passwordsService.setErrors(response.message, 'success'),
        error: (error) => this.passwordsService.setErrors(error),
        complete: () => this.loadingService.showLoading(false),
      });
    } catch (error) {
      console.log(error);
    }
  }

  private handleUpdateDataCategory(category: UpdateCategory) {
    category.categoryId = this.categoryId();
    category.userId = this.userId();
    this.loadingService.showLoading(true);
    const formData = this.categoryService.prepareFormData(category);
    this.categoryService.updateCategory(formData).subscribe({
      next: (response) => {
        this.passwordsService.setErrors(response.message, 'success');
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

  private handleUpdateDataPassword(password: UpdatePassword) {
    password.userId = this.userId();
    password.passwordId = this.passwordId();
    this.loadingService.showLoading(true);
    this.passwordsService.updatePassword(password).subscribe({
      next: (response) => {
        this.passwordsService.setErrors(response.message, 'success');
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

  public handleDeletePassword() {
    this.loadingService.showLoading(true);
    try {
      this.passwordsService.deletePassword(this.passwordId()).subscribe({
        next: (response) => {
          this.passwordsService.setErrors(response.message, 'success');

          this.modalService.resetModal();
        },
        error: (error) => this.passwordsService.setErrors(error),
        complete: () => this.loadingService.showLoading(false),
      });
    } catch (error) {
      console.log(error);
    }
  }

  public handleDeleteCategory() {
    this.loadingService.showLoading(true);
    try {
      this.categoryService.deleteCategory(this.categoryId()).subscribe({
        next: (response) => {
          this.passwordsService.setErrors(response.message, 'success');
          this.modalService.resetModal();
        },
        error: (error) => {
          this.passwordsService.setErrors(error);
          this.modalService.resetModal();
        },
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
