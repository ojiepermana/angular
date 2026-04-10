import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  AppearanceSwitcherComponent,
  ColorPickerComponent,
  LayoutContainerSwitcherComponent,
  SchemeSwitcherComponent,
} from '@ojiepermana/angular/theme/component';
import { LayoutVerticalComponent } from '@ojiepermana/angular/theme/layout';

@Component({
  selector: 'app-demo-vertical-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    AppearanceSwitcherComponent,
    ColorPickerComponent,
    LayoutContainerSwitcherComponent,
    LayoutVerticalComponent,
    SchemeSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vertical>
      <nav navigation class="flex h-full w-full flex-col gap-6 px-4 py-5">
        <div class="space-y-2">
          <p class="text-[0.7rem] uppercase tracking-[0.28em] text-foreground/50">Legacy Layout</p>
          <div>
            <h1 class="text-lg font-semibold">Vertical Showcase</h1>
            <p class="mt-1 text-sm text-foreground/70">
              Sidebar-first shell wired as a reusable library component.
            </p>
          </div>
        </div>

        <div class="grid gap-2">
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="border-transparent bg-foreground text-background"
              [routerLinkActiveOptions]="{ exact: true }"
              class="rounded-2xl border border-border px-3 py-2 text-sm transition-colors"
            >
              {{ link.label }}
            </a>
          }
        </div>

        <section class="space-y-3 rounded-[1.75rem] border border-border p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-foreground/50">Theme</p>
              <p class="text-sm font-medium">Shell Controls</p>
            </div>
            <div class="flex items-center gap-1">
              <ngt-appearance-switcher />
              <ngt-layout-container-switcher />
              <ngt-scheme-switcher />
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.24em] text-foreground/50">Accent Color</p>
            <ngt-color-picker />
          </div>
        </section>
      </nav>
    </vertical>
  `,
})
export class DemoVerticalShellComponent {
  protected readonly links = [
    { path: '/vertical', label: 'Vertical layout' },
    { path: '/horizontal', label: 'Horizontal layout' },
  ];
}
