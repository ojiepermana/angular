import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Material Symbols icon renderer.
 *
 * Dibutuhkan: konsumen harus memuat font **Material Symbols Outlined** di
 * `index.html`, mis:
 * ```html
 * <link rel="stylesheet"
 *   href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
 * ```
 */
@Component({
  selector: 'ui-nav-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    'aria-hidden': 'true',
    translate: 'no',
  },
  template: `{{ name() }}`,
})
export class UiNavIconComponent {
  readonly name = input<string>('');
  readonly class = input<string>('');
  readonly size = input<number | null>(null);

  protected readonly classes = computed(() => {
    const base =
      'material-symbols-outlined inline-flex items-center justify-center leading-none select-none';
    const extra = this.class();
    return extra ? `${base} ${extra}` : base;
  });
}
