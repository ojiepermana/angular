import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ThemeColor, ThemeService } from '@ojiepermana/angular/theme/service';

@Component({
  selector: 'color-picker',
  imports: [MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .color-picker-button-selected {
      box-shadow: 0 0 0 2px var(--mat-sys-primary);
    }

    .color-picker-swatch {
      background: var(--scheme-primary);
      border-color: color-mix(in srgb, var(--scheme-on-primary) 16%, transparent);
    }
  `,
  template: `
    <div class="flex items-center gap-1" role="group" aria-label="Theme colors">
      @for (c of colors; track c.value) {
        <button
          type="button"
          class="focus-ring inline-flex size-11 items-center justify-center rounded-full transition-transform"
          [class.color-picker-button-selected]="theme.color() === c.value"
          [attr.aria-label]="
            theme.color() === c.value
              ? 'Theme color: ' + c.label + ' (selected)'
              : 'Theme color: ' + c.label
          "
          [attr.aria-pressed]="theme.color() === c.value"
          [matTooltip]="c.label"
          (click)="theme.setColor(c.value)"
        >
          <span
            class="color-picker-swatch size-7 rounded-full border"
            [attr.theme-colors]="c.value"
            aria-hidden="true"
          ></span>
        </button>
      }
    </div>
  `,
})
export class ColorPickerComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly colors: { value: ThemeColor; label: string }[] = [
    { value: 'brand', label: 'Brand' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'red', label: 'Red' },
    { value: 'cyan', label: 'Cyan' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
  ];
}
