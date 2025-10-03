import { ModalService } from '@/shared/services/modal.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { CreatePassword, Password, UpdatePassword, ViewPassword } from '@/passwords/interfaces';
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
import { SharedService } from '@/shared/services/shared.service';

@Component({
  selector: 'app-modal',
  imports: [AuthFormComponent],
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // styles: ` .modal { position: absolute !important } `,
})
export class ModalComponent {
  private modalService = inject(ModalService);
  private passwordsService = inject(PasswordsService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private alertService = inject(AlertService);
  private sharedService = inject(SharedService);

  public shouldResetForm$ = signal(false);
  public shouldResetForm = this.sharedService.shouldResetForm;

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
  public category = this.modalService.category;

  private modalEffect = effect(() => {
    if (this.getModalType() === 'add-password' || this.getModalType() === 'update-data-password') {
      this.loadCategoriesForPasswordForm();
    }

    if (
      this.getModalType() === 'view-password' &&
      this.isAdminUser() &&
      this.modalService.method() === 'whatsapp'
    ) {
      this.handleRequestPasswordCodeWhatsapp(this.password()!);
    }

    // Load password data for view modal
    if (this.getModalType() === 'view-password' && this.modalService.method() === 'email') {
      this.handleRequestPasswordCode(this.password()!);
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
    const formData = this.sharedService.prepareFormData(password);

    this.passwordsService.createPasswordMutation.mutate(formData, {
      onSuccess: () => {
        this.sharedService.setErrors('Password Created', 'success');
        this.modalService.showModal(false);
      },
      onError: (error: any) => {
        this.sharedService.setErrors(error.message || error);
      },
    });
  }

  private handleCategoryCreation(category: CreateCategory) {
    category.userId = this.userId();

    const formData = this.sharedService.prepareFormData(category);

    // Usar la mutation de TanStack Query
    this.categoryService.createCategoryMutation.mutate(formData, {
      onSuccess: () => {
        this.sharedService.setErrors('Category Created', 'success');
        this.modalService.showModal(false);
      },
      onError: (error: any) => {
        this.sharedService.setErrors(error.message || error);
      },
    });
  }

  private handleRequestPasswordCode(password: Password) {
    this.loadingService.showLoading(true);
    try {
      this.passwordsService.requestPasswordCode(password.id).subscribe({
        next: (response) => this.sharedService.setErrors(response.message, 'success'),
        error: (error) => this.sharedService.setErrors(error),
        complete: () => this.loadingService.showLoading(false),
      });
    } catch (error) {
      console.log(error);
    }
  }

  private handleRequestPasswordCodeWhatsapp(password: Password) {
    this.loadingService.showLoading(true);
    try {
      this.passwordsService.requestPasswordCodeWhatsapp(password.id).subscribe({
        next: (response) => this.sharedService.setErrors(response.message, 'success'),
        error: (error) => this.sharedService.setErrors(error),
        complete: () => this.loadingService.showLoading(false),
      });
    } catch (error) {
      console.log(error);
    }
  }

  private handleUpdateDataCategory(category: UpdateCategory) {
    category.categoryId = this.category()?.id!;
    category.userId = this.userId();

    const formData = this.sharedService.prepareFormData(category);

    // 🚀 Usar la mutation con optimistic updates
    this.categoryService.updateCategoryMutation.mutate(formData, {
      onSuccess: (response) => {
        this.sharedService.setErrors(response.message, 'success');
        this.modalService.showModal(false);
      },
      onError: (error: any) => {
        this.sharedService.setErrors(error.message || 'Error updating category');
      },
    });
  }

  private handleUpdateDataPassword(password: UpdatePassword) {
    password.userId = this.userId();
    password.passwordId = this.password()?.id!;
    this.passwordsService.updatePasswordMutation.mutate(password, {
      onSuccess: (response) => {
        this.sharedService.setErrors(response.message, 'success');
        this.modalService.showModal(false);
      },
      onError: (error: any) => {
        this.sharedService.setErrors(error.message || 'Error updating Password');
      },
    });
  }

  public handleDeletePassword() {
    this.loadingService.showLoading(true);
    this.passwordsService.deletePasswordMutation.mutate(this.password()?.id!, {
      onSuccess: (response) => {
        this.sharedService.setErrors(response.message, 'success');
        this.modalService.resetModal();
      },
      onError: (error: any) => {
        this.sharedService.setErrors(error.message || 'Error deleting password');
        this.modalService.resetModal();
      },
    });
  }

  public handleDeleteCategory() {
    this.categoryService.deleteCategoryMutation.mutate(this.category()?.id!, {
      onSuccess: (response) => {
        this.sharedService.setErrors(response.message, 'success');
        this.modalService.resetModal();
      },
      onError: (error: any) => {
        this.sharedService.setErrors(error.message || 'Error deleting category');
        this.modalService.resetModal();
      },
    });
  }

  private handleViewPassword(data: ViewPassword) {
    const passwordId = this.modalService.password()?.id!;
    data.idPassword = passwordId;
    this.loadingService.showLoading(true);
    try {
      this.passwordsService.getPassword(data).subscribe({
        next: (response) => {
          this.sharedService.setErrors('View password', 'success');
          this.modalService.openViewPasswordModalData(response);
        },
        error: (error) => this.sharedService.setErrors(error),
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
