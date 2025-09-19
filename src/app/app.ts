import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertService } from './shared/services/alert.service';
import { AlertComponent } from './shared/components/alert/alert';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('myPasswords');

  public alertService = inject(AlertService);
}
