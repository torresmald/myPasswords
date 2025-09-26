import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from "../svg/icon";

@Component({
  selector: 'app-footer',
  imports: [IconComponent],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected date = new Date().getFullYear();
}
