import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent, type TopbarAppearance } from '@ojiepermana/angular/navigation';
import { ThemeService } from '@ojiepermana/angular/theme';
import { LayoutService } from '../core/layout.service';

/**
 * Horizontal layout — topbar (h-12) + main (scrollable).
 *
 * Data navigasi diambil dari `NavigationService`.
 * Consumer app dapat memproyeksikan brand kiri dan profile kanan.
 *
 * Markup:
 * ```html
 * <horizontal>
 *   <a ui-layout-brand>Brand</a>
 *   <button ui-layout-profile type="button">Profile</button>
 * </horizontal>
 * ```
 */
@Component({
  selector: 'horizontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, TopbarComponent],
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-layout-width]': 'layoutWidth()',
    '[attr.data-style]': 'themeStyle()',
    '[style.border-width]': 'shellBorderWidth()',
  },
  template: `
    <ui-topbar
      class="h-12 w-full shrink-0 border-b border-border"
      [style.border-bottom-width]="dividerBorderWidth()"
      [appearance]="topbarAppearance()"
      [ariaLabel]="ariaLabel()">
      <div ui-topbar-start class="flex min-w-0 items-center">
        <ng-content select="[ui-layout-brand],[ui-topbar-start]" />
      </div>
      <div ui-topbar-end class="flex min-w-0 items-center">
        <ng-content select="[ui-layout-profile],[ui-topbar-end]" />
      </div>
    </ui-topbar>
    <main class="flex-1 overflow-auto">
      <router-outlet />
    </main>
  `,
})
export class HorizontalLayoutComponent {
  private readonly layout = inject(LayoutService);
  private readonly theme = inject(ThemeService);

  readonly topbarAppearance = input<TopbarAppearance>('default');
  readonly ariaLabel = input<string>('Primary');

  protected readonly layoutWidth = this.layout.width;
  protected readonly themeStyle = this.theme.style;
  protected readonly shellBorderWidth = computed(() => (this.layoutWidth() === 'fixed' ? 'var(--border-width)' : null));
  protected readonly dividerBorderWidth = computed(() => 'var(--border-width)');

  protected readonly hostClasses = computed(() => {
    const classes = ['flex', 'h-dvh', 'w-full', 'flex-col', 'overflow-hidden', 'bg-background', 'text-foreground'];
    if (this.layoutWidth() === 'fixed') {
      classes.push(
        'lg:mx-auto',
        'lg:my-8',
        'lg:max-w-7xl',
        'lg:h-[calc(100dvh-4rem)]',
        'lg:w-[calc(100%-4rem)]',
        'lg:border',
        'lg:border-border',
        'lg:rounded-lg',
        'lg:shadow-sm',
      );
    }
    return classes.join(' ');
  });
}
