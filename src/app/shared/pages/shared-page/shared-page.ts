import { PaginationData } from '@/category/interfaces';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { ModalComponent } from '@/shared/components/modal/modal';
import { NavbarComponent } from '@/shared/components/navbar/navbar';
import { ModalService } from '@/shared/services/modal.service';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '@/shared/components/footer/footer';

@Component({
  selector: 'app-shared-page',
  imports: [NavbarComponent, ModalComponent, ButtonComponent, RouterLink, FooterComponent],
  templateUrl: './shared-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedPageComponent {
  private modalService = inject(ModalService);

  protected modal = this.modalService.modal;

  public page = input.required<number>();
  public paginationData = input<PaginationData>();
  public route = input.required<string>();
}
