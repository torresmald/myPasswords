import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertService } from './shared/services/alert.service';
import { AlertComponent } from './shared/components/alert/alert';
import { LoadingComponent } from './shared/components/loading/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, LoadingComponent],
  templateUrl: './app.html',
})
export class App {
  public alertService = inject(AlertService);
}
