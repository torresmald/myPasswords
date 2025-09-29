import { CategoryComponent } from '@/category/components/category/category';
import { CategoryService } from '@/category/services/category.service';
import { SharedPageComponent } from '@/shared/pages/shared-page/shared-page';
import { IconComponent } from '@/shared/components/svg/icon';
import { ModalService } from '@/shared/services/modal.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { PaginationService } from '@/shared/services/pagination.service';
import { LoadingComponent } from '@/shared/components/loading/loading';
import { SearchComponent } from '@/shared/components/search/search';
import { SearchPipe } from '@/shared/pipes/search.pipe';

@Component({
  selector: 'app-category-page',
  imports: [
    SharedPageComponent,
    CategoryComponent,
    IconComponent,
    LoadingComponent,
   SearchComponent,
    SearchPipe,
  ],
  templateUrl: './category-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryPageComponent {
  private routerService = inject(RouterService);
  private categoryService = inject(CategoryService);
  private modalService = inject(ModalService);
  private paginationService = inject(PaginationService);

  protected categories = this.categoryService.categories;
  protected modal = this.modalService.modal;

  protected paginationData = this.paginationService.paginationDataCategoy;

  public page = this.paginationService.page;
  public searchText = signal('');

  protected pageChanged = effect(() => {
    this.categoryService.getAllCategories(this.page()).subscribe();
  });

  protected addNewCategory() {
    this.modalService.openAddCategoryModal();
  }

  protected managePasswords() {
    this.routerService.navigateTo('/passwords?page=1');
  }

}
