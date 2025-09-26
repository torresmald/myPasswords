import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICON_MAP } from './icon-map';

@Component({
  selector: 'app-icon',
  imports: [],
  template: `
    <div
      class="inline-flex  {{ customClass() }}"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.color]="color()"
      [innerHTML]="iconContent()"
    >
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  private sanitizer = inject(DomSanitizer);

  public name = input.required<string>();
  public size = input<string>('24');
  public color = input<string>('currentColor');
  public customClass = input<string>('');

  public iconContent = computed((): SafeHtml => {
    const icon = ICON_MAP[this.name()];
    if (!icon) {
      console.warn(`Icon "${this.name()}" not found in ICON_MAP`);
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  });
}
