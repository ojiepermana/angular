import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent, type TopbarAppearance } from '@ojiepermana/angular/navigation';

/**
 * Horizontal layout — topbar (h-12) + main (scrollable).
 *
 * Data navigasi diambil dari `NavigationService`.
 *
 * Markup:
 * ```html
 * <horizontal>
 *   <!-- topbar + router-outlet dirender oleh komponen -->
 * </horizontal>
 * ```
 */
@Component({
  selector: 'horizontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, TopbarComponent],
  host: {
    class: 'flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground',
  },
  template: `
    <ui-topbar
      class="h-12 w-full shrink-0 border-b border-border"
      [appearance]="topbarAppearance()"
      [ariaLabel]="ariaLabel()" />
    <main class="flex-1 overflow-auto">
      <router-outlet />
    </main>
  `,
})
export class HorizontalLayoutComponent {
  readonly topbarAppearance = input<TopbarAppearance>('default');
  readonly ariaLabel = input<string>('Primary');
}
