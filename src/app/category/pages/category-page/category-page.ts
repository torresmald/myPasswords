import { AuthService } from '@/auth/services/auth.service';
import { CategoryComponent } from '@/category/components/category/category';
import { CategoryService } from '@/category/services/category.service';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { ModalComponent } from '@/shared/components/modal/modal';
import { NavbarComponent } from '@/shared/components/navbar/navbar';
import { ModalService } from '@/shared/services/modal.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';

@Component({
  selector: 'app-category-page',
  imports: [NavbarComponent, CategoryComponent, ModalComponent],
  templateUrl: './category-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryPageComponent {
  private routerService = inject(RouterService);

  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  // Computed para verificar si el usuario está listo
  private isUserReady = computed(() => {
    return this.authService.getUser() && this.authService.getAuthStatus() === 'authenticated';
  });

  public categories = computed(() => this.categoryService.categories());
  public modal = computed(() => this.modalService.modal());

  public categoriesEffect = effect(() => {
    if (this.isUserReady()) {
      this.categoryService.getAllCategories().subscribe();
    }
  });

  public addNewCategory() {
    this.modalService.openAddCategoryModal();
  }

  public managePasswords() {
    this.routerService.navigateTo('/passwords');
  }
}
