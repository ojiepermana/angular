import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationService, TopbarComponent } from '@ojiepermana/angular/navigation';

import { LayoutSwitcherComponent } from '../layout-switcher/layout-switcher';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher';

/**
 * Demo-scoped Horizontal shell — topbar + main. Renders brand in start slot
 * and layout-switcher + theme-switcher in end slot.
 */
@Component({
  selector: 'demo-horizontal-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, TopbarComponent, LayoutSwitcherComponent, ThemeSwitcherComponent],
  host: { class: 'flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground' },
  template: `
    <ui-topbar
      class="w-full shrink-0 border-b border-border"
      [items]="items()"
      appearance="default"
      ariaLabel="Primary"
      [autoRegister]="false">
      <span ui-topbar-start class="mr-4 text-sm font-semibold tracking-tight">@ojiepermana/angular</span>
      <div ui-topbar-end class="flex items-center gap-2">
        <demo-layout-switcher />
        <demo-theme-switcher />
      </div>
    </ui-topbar>
    <main class="flex-1 overflow-hidden">
      <router-outlet />
    </main>
  `,
})
export class HorizontalShellComponent {
  protected readonly items = inject(NavigationService).items;
}
