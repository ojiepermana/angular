import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, input } from '@angular/core';

const MATERIAL_SYMBOLS_FONT_ATTR = 'data-ui-nav-icon-font';
const MATERIAL_SYMBOLS_FONT_ID = 'material-symbols-outlined';
const MATERIAL_SYMBOLS_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';

/**
 * Material Symbols icon renderer.
 * Menyuntikkan stylesheet font sekali saat dipakai agar consumer tidak perlu
 * menambahkan `<link>` manual di `index.html`.
 */
@Component({
  selector: 'ui-nav-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[style.font-size.px]': 'size()',
    '[style.font-variation-settings]': 'fontVariationSettings',
    'aria-hidden': 'true',
    translate: 'no',
  },
  template: `{{ name() }}`,
})
export class UiNavIconComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly name = input<string>('');
  readonly class = input<string>('');
  readonly size = input<number | null>(null);

  protected readonly fontVariationSettings = '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24';

  constructor() {
    this.ensureFontStylesheet();
  }

  protected readonly classes = computed(() => {
    const base = 'material-symbols-outlined inline-flex items-center justify-center leading-none select-none';
    const extra = this.class();
    return extra ? `${base} ${extra}` : base;
  });

  private ensureFontStylesheet(): void {
    if (!isPlatformBrowser(this.platformId) || !this.doc.head) return;

    const existing = this.doc.head.querySelector(`link[${MATERIAL_SYMBOLS_FONT_ATTR}="${MATERIAL_SYMBOLS_FONT_ID}"]`);
    if (existing) return;

    const link = this.doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = MATERIAL_SYMBOLS_FONT_HREF;
    link.setAttribute(MATERIAL_SYMBOLS_FONT_ATTR, MATERIAL_SYMBOLS_FONT_ID);
    this.doc.head.appendChild(link);
  }
}
