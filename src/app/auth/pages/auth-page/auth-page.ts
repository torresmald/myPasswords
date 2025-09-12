import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  imports: [RouterOutlet],
  templateUrl: './auth-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthPageComponent { }
