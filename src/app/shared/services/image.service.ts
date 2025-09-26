import {  Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imageCategoryBase64$ = signal<File | null>(null);
  public imageCategoryBase64 = this.imageCategoryBase64$.asReadonly()

  public setImageCategoryBase64(file: File) {
    this.imageCategoryBase64$.set(file);
  }

  public async onSelectImage(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      this.setImageCategoryBase64(file);
    }
  }
}
