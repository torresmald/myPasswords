import { CreateCategory, UpdateCategory } from '@/category/interfaces';
import { inject, Injectable, signal } from '@angular/core';
import { ImageService } from './image.service';
import { AlertService } from './alert.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private imageService = inject(ImageService);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  public shouldResetForm = signal(false);

  public prepareFormData(category: CreateCategory | UpdateCategory) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('userId', category.userId);
    if ('categoryId' in category) {
      formData.append('categoryId', category.categoryId);
    }
    if (this.imageService.imageCategoryBase64() != null) {
      category.image = this.imageService.imageCategoryBase64()!;
      formData.append('image', category.image);
    }
    return formData;
  }

  public setErrors(message: string, type: 'success' | 'error' = 'error') {
    this.alertService.setAlertMessage(message);
    this.alertService.showAlert(true);
    this.alertService.setAlertType(type);
    this.shouldResetForm.set(true);
    this.loadingService.showLoading(false);
  }
}
