import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationService, SidebarComponent } from '@ojiepermana/material/navigation';

import { LayoutSwitcherComponent } from '../layout-switcher/layout-switcher';
import { ThemeSchemeToggleComponent } from '../theme-scheme-toggle/theme-scheme-toggle';

/**
 * Demo-scoped Vertical shell — sidebar + main. Injects `[ui-sidebar-header]`
 * slot (brand + layout switcher) and `[ui-sidebar-footer]` (scheme toggle).
 */
@Component({
  selector: 'demo-vertical-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, LayoutSwitcherComponent, ThemeSchemeToggleComponent],
  host: { class: 'flex h-dvh w-full overflow-hidden bg-background text-foreground' },
  template: `
    <ui-sidebar [items]="items()" appearance="default" position="left" ariaLabel="Primary" [autoRegister]="false">
      <div ui-sidebar-header class="flex w-full items-center justify-between gap-2">
        <span class="text-sm font-semibold tracking-tight">@ojiepermana/material</span>
        <demo-layout-switcher />
      </div>
      <div ui-sidebar-footer class="flex items-center justify-between gap-2 px-2">
        <span class="text-xs text-muted-foreground">v0.0.1</span>
        <demo-theme-scheme-toggle />
      </div>
    </ui-sidebar>
    <main class="flex-1 overflow-hidden">
      <router-outlet />
    </main>
  `,
})
export class VerticalShellComponent {
  protected readonly items = inject(NavigationService).items;
}
