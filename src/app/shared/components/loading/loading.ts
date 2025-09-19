import { LoadingService } from '@/shared/services/loading.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {

  private loadingService = inject(LoadingService)

  public loading = computed(() => this.loadingService.loading())
}
