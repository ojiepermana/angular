import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent, type TopbarAppearance } from '@ojiepermana/angular/navigation';
import { ThemeService } from '@ojiepermana/angular/theme';
import { LayoutService } from '../core/layout.service';

/**
 * Horizontal layout — themed topbar + main (scrollable).
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
  },
  template: `
    <div [class]="frameClasses()" [style.border-width]="shellBorderWidth()">
      <ui-topbar
        class="w-full shrink-0 border-b border-border"
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
      <main [class]="mainClasses()">
        <router-outlet />
      </main>
    </div>
  `,
})
export class HorizontalLayoutComponent {
  private readonly layout = inject(LayoutService);
  private readonly theme = inject(ThemeService);

  readonly topbarAppearance = input<TopbarAppearance>('default');
  readonly ariaLabel = input<string>('Primary');

  protected readonly layoutWidth = this.layout.width;
  protected readonly themeStyle = this.theme.style;
  protected readonly isConstrainedWidth = computed(() => this.layoutWidth() !== 'full');
  protected readonly isWideWidth = computed(() => this.layoutWidth() === 'wide');
  protected readonly shellBorderWidth = computed(() => (this.isConstrainedWidth() ? 'var(--border-width)' : null));
  protected readonly dividerBorderWidth = computed(() => 'var(--border-width)');

  protected readonly hostClasses = computed(() => {
    const classes = ['block', 'h-dvh', 'w-full', 'overflow-hidden', 'bg-background', 'text-foreground'];
    if (this.isConstrainedWidth()) {
      classes.push('box-border', 'lg:p-8');
    }
    return classes.join(' ');
  });

  protected readonly frameClasses = computed(() => {
    const classes = ['flex', 'h-full', 'w-full', 'flex-col', 'overflow-hidden'];
    if (this.isConstrainedWidth()) {
      classes.push('lg:border', 'lg:border-border', 'lg:rounded-lg', 'lg:shadow-sm');
    }
    return classes.join(' ');
  });

  protected readonly mainClasses = computed(() => {
    const classes = ['min-w-0', 'flex-1', 'overflow-auto'];
    if (this.layoutWidth() === 'container') {
      classes.push('mx-auto', 'w-full', 'max-w-7xl');
    } else if (this.isWideWidth()) {
      classes.push('mx-auto', 'w-full', 'max-w-screen-2xl');
    }
    return classes.join(' ');
  });
}
