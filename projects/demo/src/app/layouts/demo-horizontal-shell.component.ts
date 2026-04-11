import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  AppearanceSwitcherComponent,
  LayoutContainerSwitcherComponent,
  SchemeSwitcherComponent,
} from '@ojiepermana/angular/theme/component';
import { ThemeService } from '@ojiepermana/angular/theme/service';
import { LayoutHorizontalComponent } from '@ojiepermana/angular/theme/layout';

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
    <horizontal>
      <div headerBrand class="flex min-w-0 items-center gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border text-sm font-semibold"
          aria-hidden="true"
        >
          H
        </div>
        <div class="min-w-0">
          <p class="truncate text-[0.7rem] uppercase tracking-[0.28em] text-foreground/50">
            Legacy Layout
          </p>
          <h1 class="truncate text-sm font-semibold">Showcase</h1>
        </div>
      </div>

      <div headerNavigation class="flex items-center gap-2" role="navigation" aria-label="Primary">
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
      </div>

      <div headerActions class="flex items-center gap-1 sm:gap-2">
        <appearance-switcher />
        <layout-container-switcher />
        <scheme-switcher />
      </div>
    </horizontal>
  `,
})
export class DemoHorizontalShellComponent {
  private readonly theme = inject(ThemeService);

  protected readonly links = [
    { path: '/vertical', label: 'Vertical' },
    { path: '/horizontal', label: 'Horizontal' },
  ];

  constructor() {
    this.theme.setLayoutMode('horizontal');
  }
}
