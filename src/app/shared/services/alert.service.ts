import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alert$ = signal(false);
  private alertMessage$ = signal('');
  private alertType$ = signal<'error' | 'success'>('error');

  public alert = computed(() => this.alert$());
  public alertMessage = computed(() => this.alertMessage$());
  public alertType = computed(() => this.alertType$());

  public showAlert(condition: boolean) {
    this.alert$.set(condition);
    setTimeout(() => {
      this.alert$.set(!condition);
    }, 3000);
  }

  public setAlertMessage(message: string) {
    this.alertMessage$.set(message);
  }

  public setAlertType(type: 'error' | 'success') {
    this.alertType$.set(type);
  }
}
