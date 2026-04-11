import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ThemeService } from '@ojiepermana/angular/theme/service';

@Component({
  selector: 'color-picker',
  imports: [MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .color-picker-button {
      border: 1px solid transparent;
      background: transparent;
    }

    .color-picker-button-selected {
      border-color: color-mix(in oklab, var(--ring) 42%, var(--border));
      background: color-mix(in oklab, var(--accent) 60%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ring) 26%, transparent);
    }

    .color-picker-swatch {
      background: var(--theme-primary);
      border-color: color-mix(in oklab, var(--theme-primary) 42%, white 58%);
    }
  `,
  template: `
    <div class="flex items-center gap-1" role="group" aria-label="Theme colors">
      @for (c of colors(); track c.value) {
        <button
          type="button"
          class="color-picker-button focus-ring inline-flex size-11 items-center justify-center rounded-full p-1.5 transition-transform duration-150 hover:-translate-y-px"
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
            [attr.data-theme-color]="c.value"
            aria-hidden="true"
          ></span>
        </button>
      }
    </div>
  `,
})
export class ColorPickerComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly colors = this.theme.colorOptions;
}
