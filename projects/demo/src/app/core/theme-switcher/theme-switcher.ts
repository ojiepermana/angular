import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import {
  COLORS,
  MODES,
  STYLES,
  ThemeService,
  type ThemeColor,
  type ThemeMode,
  type ThemeStyle,
} from '@ojiepermana/material/theme';
import { ButtonComponent } from '@ojiepermana/material/shadcn';

const PANEL_ID = 'demo-theme-switcher-panel';

type ThemeSwitcherPlacement = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';

const COLOR_SWATCHES: Record<ThemeColor, string> = {
  blue: '217 91% 60%',
  red: '0 72% 51%',
  green: '142 71% 45%',
  purple: '271 81% 56%',
  amber: '38 92% 50%',
};

@Component({
  selector: 'demo-theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  host: { class: 'relative inline-flex' },
  template: `
    <button
      ui-button
      variant="ghost"
      size="sm"
      type="button"
      [attr.aria-controls]="panelId"
      [attr.aria-expanded]="open()"
      (click)="toggleOpen()">
      <span class="material-symbols-outlined text-base">palette</span>
      <span class="hidden md:inline">Theme</span>
    </button>

    @if (open()) {
      <div
        [id]="panelId"
        [class]="panelClasses()"
        role="group"
        aria-label="Theme settings"
        tabindex="-1"
        (keydown.escape)="close()">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div class="grid gap-1">
            <p class="text-sm font-semibold tracking-tight">Theme layers</p>
            <p class="text-xs text-muted-foreground">{{ summary() }}</p>
          </div>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close theme switcher"
            (click)="close()">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div class="grid gap-4">
          <section class="grid gap-2" aria-labelledby="theme-mode-label">
            <p
              id="theme-mode-label"
              class="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Mode
            </p>
            <div class="grid grid-cols-2 gap-2">
              @for (mode of modes; track mode) {
                <button
                  type="button"
                  class="inline-flex min-h-10 items-center justify-center rounded-md border px-3 py-2 text-sm capitalize transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  [attr.aria-pressed]="theme.mode() === mode"
                  [class.border-primary]="theme.mode() === mode"
                  [class.bg-primary]="theme.mode() === mode"
                  [class.text-primary-foreground]="theme.mode() === mode"
                  [class.border-border]="theme.mode() !== mode"
                  [class.bg-background]="theme.mode() !== mode"
                  [class.text-foreground]="theme.mode() !== mode"
                  (click)="setMode(mode)">
                  {{ mode }}
                </button>
              }
            </div>
          </section>

          <section class="grid gap-2" aria-labelledby="theme-color-label">
            <p
              id="theme-color-label"
              class="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Color
            </p>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
              @for (color of colors; track color) {
                <button
                  type="button"
                  class="inline-flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm capitalize transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  [attr.aria-pressed]="theme.color() === color"
                  [class.border-primary]="theme.color() === color"
                  [class.bg-primary]="theme.color() === color"
                  [class.text-primary-foreground]="theme.color() === color"
                  [class.border-border]="theme.color() !== color"
                  [class.bg-background]="theme.color() !== color"
                  [class.text-foreground]="theme.color() !== color"
                  (click)="setColor(color)">
                  <span class="h-3 w-3 rounded-full border border-black/10" [style.background]="swatch(color)"></span>
                  <span>{{ color }}</span>
                </button>
              }
            </div>
          </section>

          <section class="grid gap-2" aria-labelledby="theme-style-label">
            <p
              id="theme-style-label"
              class="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Style
            </p>
            <div class="grid grid-cols-2 gap-2">
              @for (style of styles; track style) {
                <button
                  type="button"
                  class="inline-flex min-h-10 items-center justify-center rounded-md border px-3 py-2 text-sm capitalize transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  [attr.aria-pressed]="theme.style() === style"
                  [class.border-primary]="theme.style() === style"
                  [class.bg-primary]="theme.style() === style"
                  [class.text-primary-foreground]="theme.style() === style"
                  [class.border-border]="theme.style() !== style"
                  [class.bg-background]="theme.style() !== style"
                  [class.text-foreground]="theme.style() !== style"
                  (click)="setStyle(style)">
                  {{ style }}
                </button>
              }
            </div>
          </section>
        </div>
      </div>
    }
  `,
})
export class ThemeSwitcherComponent {
  protected readonly theme = inject(ThemeService);

  readonly placement = input<ThemeSwitcherPlacement>('bottom-end');

  protected readonly open = signal(false);
  protected readonly panelId = PANEL_ID;
  protected readonly modes = MODES;
  protected readonly colors = COLORS;
  protected readonly styles = STYLES;
  protected readonly summary = computed(() => `${this.theme.mode()} / ${this.theme.color()} / ${this.theme.style()}`);
  protected readonly panelClasses = computed(() => {
    const base =
      'absolute z-50 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg';
    const placement = this.placement();
    const vertical = placement.startsWith('top') ? 'bottom-[calc(100%+0.5rem)]' : 'top-[calc(100%+0.5rem)]';
    const horizontal = placement.endsWith('start') ? 'left-0' : 'right-0';
    return `${base} ${vertical} ${horizontal}`;
  });

  protected toggleOpen(): void {
    this.open.update((value) => !value);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected setMode(mode: ThemeMode): void {
    this.theme.setMode(mode);
  }

  protected setColor(color: ThemeColor): void {
    this.theme.setColor(color);
  }

  protected setStyle(style: ThemeStyle): void {
    this.theme.setStyle(style);
  }

  protected swatch(color: ThemeColor): string {
    return `hsl(${COLOR_SWATCHES[color]})`;
  }
}
