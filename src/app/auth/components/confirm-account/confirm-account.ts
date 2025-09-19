import { AuthService } from '@/auth/services/auth.service';
import { AlertService } from '@/shared/services/alert.service';
import { RouterService } from '@/shared/services/router.service';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-account',
  imports: [],
  templateUrl: './confirm-account.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConfirmAccountComponent implements OnInit {
  public token = input.required<string>();
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private routerService = inject(RouterService);

  ngOnInit(): void {
    this.confirmAccount(this.token());
  }

  private confirmAccount(token: string) {
    this.authService.confirmAccount(token).subscribe({
      next: (response) => {
        this.alertService.setAlertMessage('User Confirmed');
        this.alertService.setAlertType('success');
        this.alertService.showAlert(true);
        setTimeout(() => {
          this.routerService.navigateTo('/auth/login');
        }, 2000);
      },
      error: (errorMessage) => {
        this.alertService.setAlertMessage(errorMessage);
        this.alertService.setAlertType('error');
        this.alertService.showAlert(true);
      },
    });
  }
}
