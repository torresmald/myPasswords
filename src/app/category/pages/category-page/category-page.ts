import { CategoryComponent } from '@/category/components/category/category';
import { CategoryService } from '@/category/services/category.service';
import { SharedPageComponent } from '@/shared/pages/shared-page/shared-page';
import { IconComponent } from '@/shared/components/svg/icon';
import { ModalService } from '@/shared/services/modal.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

@Component({
  selector: 'app-category-page',
  imports: [SharedPageComponent, CategoryComponent, IconComponent],
  templateUrl: './category-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryPageComponent {
  private routerService = inject(RouterService);

  private categoryService = inject(CategoryService);
  private modalService = inject(ModalService);

  protected categories = this.categoryService.categories;
  protected modal = computed(() => this.modalService.modal());

  protected addNewCategory() {
    this.modalService.openAddCategoryModal();
  }

  protected managePasswords() {
    this.routerService.navigateTo('/passwords');
  }
}
