import { ModalComponent } from '@/shared/components/modal/modal';
import { NavbarComponent } from '@/shared/components/navbar/navbar';
import { ModalService } from '@/shared/services/modal.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

@Component({
  selector: 'app-shared-page',
  imports: [NavbarComponent, ModalComponent],
  templateUrl: './shared-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedPageComponent {
  private modalService = inject(ModalService);

  public modal = computed(() => this.modalService.modal());



}
