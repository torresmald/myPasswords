import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  // Inputs
  public disabled = input<boolean>(false);
  public variant = input<'primary' | 'secondary' | 'danger'>('primary');
  public size = input<'sm' | 'md' | 'lg'>('md');

  // Output para el evento click
  public clicked = output<void>();

  // Método para manejar el click
  public onButtonClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }

  // Método para obtener las clases CSS dinámicamente
  public getButtonClasses(): string {
    const baseClasses = 'rounded-md cursor-pointer transition-colors duration-200 font-medium';
    const disabledClasses = 'opacity-50 cursor-not-allowed';

    // Size classes
    let sizeClasses = '';
    switch (this.size()) {
      case 'sm':
        sizeClasses = 'px-2 py-1 text-xs';
        break;
      case 'md':
        sizeClasses = 'px-4 py-2 text-sm';
        break;
      case 'lg':
        sizeClasses = 'px-6 py-3 text-base';
        break;
    }

    // Variant classes
    let variantClasses = '';
    switch (this.variant()) {
      case 'primary':
        variantClasses = 'bg-blue-500 hover:bg-blue-600 text-white';
        break;
      case 'secondary':
        variantClasses = 'bg-gray-500 hover:bg-gray-600 text-white';
        break;
      case 'danger':
        variantClasses = 'bg-red-500 hover:bg-red-600 text-white';
        break;
    }

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${this.disabled() ? disabledClasses : ''}`;
  }
}
