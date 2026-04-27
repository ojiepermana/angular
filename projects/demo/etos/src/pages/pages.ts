import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService } from '@ojiepermana/angular/layout';
import {
  EtosHorizontalLayoutComponent,
  EtosThemeSwitcherComponent,
  EtosVerticalLayoutComponent,
} from '@ojiepermana/angular/etos';

@Component({
  selector: 'app-pages',
  imports: [RouterLink, EtosHorizontalLayoutComponent, EtosThemeSwitcherComponent, EtosVerticalLayoutComponent],
  host: {
    class: 'contents',
  },
  template: `
    @switch (layoutMode()) {
      @case ('horizontal') {
        <etos-horizontal-layout>
          <a ui-layout-brand routerLink="/" class="etos-brand-link">
            <span class="etos-brand-mark">OJ</span>
            <span class="etos-brand-copy">
              <span class="etos-brand-name">Ojiepermana UI</span>
              <span class="etos-brand-subtitle">Angular component library</span>
            </span>
          </a>

          <div ui-layout-profile class="etos-profile-trigger gap-2 px-0 py-0">
            <etos-theme-switcher
              [userName]="profileName"
              [userSubtitle]="profileTitle"
              [avatarSrc]="avatarSrc"
              avatarAlt="Portrait of Ojie Permana"
              [showNotificationShortcut]="true"
              aria-label="Open Etos user settings" />
          </div>
        </etos-horizontal-layout>
      }
      @default {
        <etos-vertical-layout>
          <a ui-sidebar-header routerLink="/" class="etos-brand-link min-h-0 w-full px-0 py-0">
            <span class="etos-brand-mark">OJ</span>
            <span class="etos-brand-copy">
              <span class="etos-brand-name">Ojiepermana UI</span>
              <span class="etos-brand-subtitle">Angular component library</span>
            </span>
          </a>

          <div ui-sidebar-footer class="flex h-full w-full min-w-0 items-center justify-start gap-3 px-0 py-0">
            <etos-theme-switcher
              [userName]="profileName"
              [userSubtitle]="profileTitle"
              [avatarSrc]="avatarSrc"
              avatarAlt="Portrait of Ojie Permana"
              popoverAlign="start" />

            <div class="min-w-0 flex flex-col gap-px">
              <span class="truncate text-sm font-semibold leading-none text-foreground">{{ profileName }}</span>
              <span class="truncate text-xs leading-none text-muted-foreground">{{ profileTitle }}</span>
            </div>
          </div>
        </etos-vertical-layout>
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pages {
  protected readonly avatarSrc = '/avatar-ojie.svg';
  protected readonly profileName = 'Ojie Permana';
  protected readonly profileTitle = 'Etos design system navigator';
  protected readonly layoutMode = inject(LayoutService).mode;
}
