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
      <sidebar [appearance]="sidebarAppearance()" [position]="sidebarPosition()" [ariaLabel]="ariaLabel()" />
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
  protected readonly isConstrainedWidth = computed(() => this.layoutWidth() !== 'full');
  protected readonly isWideWidth = computed(() => this.layoutWidth() === 'wide');
  protected readonly shellBorderWidth = computed(() => (this.isConstrainedWidth() ? 'var(--border-width)' : null));

  protected readonly hostClasses = computed(() => {
    const classes = ['block', 'h-dvh', 'w-full', 'overflow-hidden', 'bg-background', 'text-foreground'];
    if (this.isConstrainedWidth()) {
      classes.push('box-border', 'lg:p-8');
    }
    return classes.join(' ');
  });

  protected readonly frameClasses = computed(() => {
    const classes = ['flex', 'h-full', 'w-full', 'overflow-hidden'];
    if (this.isConstrainedWidth()) {
      classes.push(
        'lg:mx-auto',
        this.isWideWidth() ? 'lg:max-w-[calc(17.5rem+96rem)]' : 'lg:max-w-[calc(17.5rem+80rem)]',
        'lg:border',
        'lg:border-border',
        'lg:rounded-lg',
        'lg:shadow-sm',
      );
    }
    return classes.join(' ');
  });

  protected readonly mainClasses = computed(() => {
    const classes = ['min-w-0', 'flex-1', 'overflow-auto'];
    if (this.layoutWidth() === 'container') {
      classes.push('w-full', 'max-w-7xl');
    } else if (this.isWideWidth()) {
      classes.push('w-full', 'max-w-screen-2xl');
    }
    return classes.join(' ');
  });
}
