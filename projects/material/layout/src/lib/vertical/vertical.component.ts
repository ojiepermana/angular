import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  SidebarComponent,
  type SidebarAppearance,
  type SidebarMode,
  type SidebarPosition,
} from '@ojiepermana/material/navigation';

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
    class: 'flex h-dvh w-full overflow-hidden bg-background text-foreground',
  },
  template: `
    <ui-sidebar [appearance]="sidebarAppearance()" [position]="sidebarPosition()" [ariaLabel]="ariaLabel()" />
    <main class="flex-1 overflow-auto">
      <router-outlet />
    </main>
  `,
})
export class VerticalLayoutComponent {
  readonly sidebarAppearance = input<SidebarAppearance>('default');
  readonly sidebarPosition = input<SidebarPosition>('left');
  readonly sidebarMode = input<SidebarMode>('side');
  readonly ariaLabel = input<string>('Primary');
}
