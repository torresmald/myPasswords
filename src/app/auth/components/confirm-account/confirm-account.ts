import { AuthService } from '@/auth/services/auth.service';
import { LoadingService } from '@/shared/services/loading.service';
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
  private routerService = inject(RouterService);
  private loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.confirmAccount(this.token());
  }

  private confirmAccount(token: string) {
    this.loadingService.showLoading(true);

    try {
      this.authService.confirmAccount(token).subscribe({
        next: (response) => {
          this.authService.setErrors('User Confirmed', 'success');
          this.routerService.navigateTo('/auth/login');
        },
        error: (errorMessage) => {
          this.authService.setErrors(errorMessage);
        },
        complete: () => this.loadingService.showLoading(false),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
