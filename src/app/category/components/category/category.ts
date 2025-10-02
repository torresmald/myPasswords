import { Category } from '@/category/interfaces';
import { IconComponent } from '@/shared/components/svg/icon';
import { ModalService } from '@/shared/services/modal.service';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-category',
  imports: [IconComponent],
  templateUrl: './category.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
  public category = input.required<Category>();

  private modalService = inject(ModalService);

  protected getCategoryBackgroundImage(categoryImage?: string): string {
    if (categoryImage) {
      return `url(${categoryImage})`;
    }
    const defaultImage =
      'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp';
    return `url(${defaultImage})`;
  }

  protected deleteCategory() {
    this.modalService.openDeleteCategory(this.category());
  }

  protected updateCategory() {
    this.modalService.openUpdateDataCategoryModal(this.category());
  }
}
