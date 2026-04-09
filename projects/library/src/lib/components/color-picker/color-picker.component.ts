import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ThemeService } from '../../theme/theme.service';
import { ThemeColor } from '../../theme/theme.types';

@Component({
  selector: 'ngt-color-picker',
  imports: [MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2">
      @for (c of colors; track c.value) {
        <button
          class="w-7 h-7 rounded-full transition-all ring-offset-2"
          [style.background]="c.preview"
          [class.ring-2]="theme.color() === c.value"
          [matTooltip]="c.label"
          (click)="theme.setColor(c.value)"
        ></button>
      }
    </div>
  `,
})
export class ColorPickerComponent {
  protected theme = inject(ThemeService);

  colors: { value: ThemeColor; label: string; preview: string }[] = [
    { value: 'brand', label: 'Brand', preview: '#6366f1' },
    { value: 'blue', label: 'Blue', preview: '#1d4ed8' },
    { value: 'green', label: 'Green', preview: '#16a34a' },
    { value: 'red', label: 'Red', preview: '#dc2626' },
    { value: 'cyan', label: 'Cyan', preview: '#0891b2' },
    { value: 'purple', label: 'Purple', preview: '#9333ea' },
    { value: 'orange', label: 'Orange', preview: '#ea580c' },
  ];
}
