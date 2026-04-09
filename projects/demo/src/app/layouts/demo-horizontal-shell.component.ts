import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  AppearanceSwitcherComponent,
  LayoutContainerSwitcherComponent,
  SchemeSwitcherComponent,
} from '@ojiepermana/angular/theme/component';
import { LayoutHorizontalComponent } from '@ojiepermana/angular/layouts';

@Component({
  selector: 'app-demo-horizontal-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    AppearanceSwitcherComponent,
    LayoutContainerSwitcherComponent,
    LayoutHorizontalComponent,
    SchemeSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngt-layout-horizontal>
      <div headerBrand class="flex min-w-0 items-center gap-3">
        <div
          class="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border text-sm font-semibold"
          aria-hidden="true"
        >
          H
        </div>
        <div class="min-w-0">
          <p class="truncate text-[0.7rem] uppercase tracking-[0.28em] text-foreground/50">
            Legacy Layout
          </p>
          <h1 class="truncate text-sm font-semibold">Horizontal Showcase</h1>
        </div>
      </div>

      <nav headerNavigation class="flex items-center gap-2 py-2">
        @for (link of links; track link.path) {
          <a
            [routerLink]="link.path"
            routerLinkActive="border-transparent bg-foreground text-background"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-full border border-border px-3 py-1.5 text-sm transition-colors"
          >
            {{ link.label }}
          </a>
        }
      </nav>

      <div header class="text-sm text-foreground/60">
        Reusable application shell for top-nav flows.
      </div>

      <div headerActions class="flex items-center gap-1 sm:gap-2">
        <ngt-appearance-switcher />
        <ngt-layout-container-switcher />
        <ngt-scheme-switcher />
      </div>
    </ngt-layout-horizontal>
  `,
})
export class DemoHorizontalShellComponent {
  protected readonly links = [
    { path: '/vertical', label: 'Vertical' },
    { path: '/horizontal', label: 'Horizontal' },
  ];
}
