import {  Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alert$ = signal(false);
  private alertMessage$ = signal('');
  private alertType$ = signal<'error' | 'success'>('error');

  public alert = this.alert$.asReadonly();
  public alertMessage = this.alertMessage$.asReadonly();
  public alertType = this.alertType$.asReadonly();

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
