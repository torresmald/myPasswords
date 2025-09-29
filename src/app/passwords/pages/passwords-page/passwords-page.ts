import { PasswordComponent } from '@/passwords/components/password/password';
import { PasswordsService } from '@/passwords/services/passwords.service';
import { IconComponent } from '@/shared/components/svg/icon';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ModalService } from '@/shared/services/modal.service';
import { RouterService } from '@/shared/services/router.service';
import { SharedPageComponent } from '@/shared/pages/shared-page/shared-page';
import { PaginationService } from '@/shared/services/pagination.service';
import { LoadingComponent } from '@/shared/components/loading/loading';
import { SearchPipe } from '@/shared/pipes/search.pipe';
import { SearchComponent } from '@/shared/components/search/search';

@Component({
  selector: 'app-passwords-page',
  imports: [
    PasswordComponent,
    SharedPageComponent,
    IconComponent,
    LoadingComponent,
    SearchPipe,
    SearchComponent,
  ],
  templateUrl: './passwords-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PasswordsPageComponent {
  private passwordsService = inject(PasswordsService);
  private modalService = inject(ModalService);
  private routerService = inject(RouterService);
  private paginationService = inject(PaginationService);

  public passwords = this.passwordsService.passwords;
  public modal = this.modalService.modal;
  public page = this.paginationService.page;

  protected paginationData = this.paginationService.paginationDataPassword;
  protected searchText = signal('');

  protected pageChanged = effect(() => {
    this.passwordsService.getAllPasswords(this.page()).subscribe();
  });

  public addPassword() {
    this.modalService.openAddPasswordModal();
  }

  public manageCategories() {
    this.routerService.navigateTo('/categories?page=1');
  }
}
