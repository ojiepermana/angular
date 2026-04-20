import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  SidebarComponent,
  type SidebarAppearance,
  type SidebarMode,
  type SidebarPosition,
} from '@ojiepermana/angular/navigation';
import { ThemeService } from '@ojiepermana/angular/theme';
import { LayoutService } from '../core/layout.service';

/**
 * Vertical layout — sidebar + main (scrollable).
 *
 * Data navigasi diambil dari `NavigationService` (register via
 * `NavigationService.registerItems()` di bootstrap). Main memegang
 * `<router-outlet>` dan scroll jika konten panjang.
 *
 * Markup:
 * ```html
 * <vertical>
 *   <!-- sidebar + router-outlet dirender oleh komponen -->
 * </vertical>
 * ```
 */
@Component({
  selector: 'vertical',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent],
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-layout-width]': 'layoutWidth()',
    '[attr.data-style]': 'themeStyle()',
  },
  template: `
    <div [class]="frameClasses()" [style.border-width]="shellBorderWidth()">
      <ui-sidebar
        [appearance]="sidebarAppearance()"
        [position]="sidebarPosition()"
        [ariaLabel]="ariaLabel()"
        [style.border-left-width]="dividerBorderWidth()"
        [style.border-right-width]="dividerBorderWidth()" />
      <main [class]="mainClasses()">
        <router-outlet />
      </main>
    </div>
  `,
})
export class VerticalLayoutComponent {
  private readonly layout = inject(LayoutService);
  private readonly theme = inject(ThemeService);

  readonly sidebarAppearance = input<SidebarAppearance>('default');
  readonly sidebarPosition = input<SidebarPosition>('left');
  readonly sidebarMode = input<SidebarMode>('side');
  readonly ariaLabel = input<string>('Primary');

  protected readonly layoutWidth = this.layout.width;
  protected readonly themeStyle = this.theme.style;
  protected readonly shellBorderWidth = computed(() => (this.layoutWidth() === 'fixed' ? 'var(--border-width)' : null));
  protected readonly dividerBorderWidth = computed(() => 'var(--border-width)');

  protected readonly hostClasses = computed(() => {
    const classes = ['block', 'h-dvh', 'w-full', 'overflow-hidden', 'bg-background', 'text-foreground'];
    if (this.layoutWidth() === 'fixed') {
      classes.push('box-border', 'lg:p-8');
    }
    return classes.join(' ');
  });

  protected readonly frameClasses = computed(() => {
    const classes = ['flex', 'h-full', 'w-full', 'overflow-hidden'];
    if (this.layoutWidth() === 'fixed') {
      classes.push('lg:border', 'lg:border-border', 'lg:rounded-lg', 'lg:shadow-sm');
    }
    return classes.join(' ');
  });

  protected readonly mainClasses = computed(() => {
    const classes = ['flex-1', 'overflow-auto'];
    if (this.layoutWidth() === 'fixed') classes.push('lg:mx-auto', 'lg:max-w-7xl');
    return classes.join(' ');
  });
}
