import { ModalService } from '@/shared/services/modal.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { CreatePassword } from '@/passwords/interfaces';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { AlertService } from '@/shared/services/alert.service';
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
import { LoadingComponent } from '../loading/loading';

@Component({
  selector: 'app-modal',
  imports: [AuthFormComponent, LoadingComponent],
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  private modalService = inject(ModalService);
  private passwordsService = inject(PasswordsService);
  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  // Modal state
  public getModal = computed(() => this.modalService.modal());
  public getTitle = computed(() => this.modalService.title());
  public getModalType = computed(() => this.modalService.modalType());

  public loading = computed(() => this.loadingService.loading());

  // Form configuration signals
  private formConfig$ = signal<FormConfig | null>(null);
  public shouldResetForm$ = signal(false);
  public checked = signal(false);
  private userId = computed(() => this.authService.getUser()?.id!);

  private modalEffect = effect(() => {
    if (this.getModalType() === 'add-password') {
      this.loadCategoriesForPasswordForm();
    }

    // Load password data for view modal
    if (this.getModalType() === 'view-password') {
      this.loadPasswordData();
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
        return 'Update Password';
      default:
        return 'Submit';
    }
  });

  public shouldResetForm = computed(() => this.shouldResetForm$());

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

  private loadPasswordData(): void {
    const passwordId = this.modalService.passwordId();
    if (passwordId) {
      this.passwordsService.getPassword(passwordId).subscribe();
    }
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
        this.handleViewPassword(formData as CreatePassword);
        break;
    }
  }

  private handlePasswordCreation(password: CreatePassword) {
    password.userId = this.userId();
    try {
      this.loadingService.showLoading(true);

      this.passwordsService.createPassword(password).subscribe((response) => {
        if (response) {
          this.setResponses('Created New Password', 'success', true, false);
        }
      });
    } catch (error) {
      console.log(error);
      this.setResponses('Error Create Password', 'error', true, false);
    } finally {
      this.loadingService.showLoading(true);
    }
  }

  private handleCategoryCreation(category: CreateCategory) {
    category.userId = this.userId();
    try {
      this.loadingService.showLoading(true);
      const formData = this.prepareFormData(category);
      this.categoryService.createCategory(formData).subscribe((response) => {
        if (response) {
          this.setResponses('Created New Category', 'success', true, false);
        }
      });
    } catch (error) {
      console.log(error);
      this.setResponses('Error Create Category', 'error', true, false);
    } finally {
      this.loadingService.showLoading(false);
    }
  }

  private handleViewPassword(password: CreatePassword) {
    //TODO ENVIAR EMAIL PARA VER EL PASSWORD
    console.log('Update password:', password);
    this.setResponses('Password Updated', 'success', true, false);
  }

  private setResponses(
    message: string,
    type: 'error' | 'success',
    showAlert: boolean,
    showModal: boolean
  ) {
    this.alertService.setAlertMessage(message);
    this.alertService.setAlertType(type);
    this.alertService.showAlert(showAlert);
    this.modalService.showModal(showModal);
    this.loadingService.showLoading(false);

    if (!showModal) {
      this.shouldResetForm$.set(true);
    }
  }

  public async onSelectImage(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      this.categoryService.setImageCategoryBase64(file);
    }
  }

  private prepareFormData(category: CreateCategory) {
    if (this.categoryService.imageCategoryBase64())
      category.image = this.categoryService.imageCategoryBase64()!;
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('userId', category.userId);
    formData.append('image', category.image ?? '');
    return formData;
  }
}
