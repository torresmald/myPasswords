import { AlertService } from '@/shared/services/alert.service';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  public alertService = inject(AlertService)

 }
