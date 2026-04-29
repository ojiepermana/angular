import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EtosLayoutComponent,
  type EtosThemeSwitcherQuickAction,
  EtosThemeSwitcherComponent,
  type EtosThemeSwitcherUserInfo,
} from '@ojiepermana/angular/etos';

@Component({
  selector: 'app-pages',
  imports: [RouterLink, EtosLayoutComponent, EtosThemeSwitcherComponent],
  host: {
    class: 'block min-h-dvh bg-background text-foreground',
  },
  template: `
    <ng-template #layoutBrand>
      <a routerLink="/" class="flex min-w-0 items-center gap-3 px-2 py-1.5 transition-colors">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[0.7rem] font-semibold tracking-[0.22em] text-background">
          OJ
        </span>
        <span class="hidden min-w-0 flex-col gap-0.5 sm:flex">
          <span class="truncate text-sm font-semibold leading-none tracking-tight">Ojiepermana UI</span>
          <span class="truncate text-xs leading-none text-muted-foreground">Angular component library</span>
        </span>
      </a>
    </ng-template>

    <ng-template #layoutPanel>
      <div class="flex h-full w-full min-w-0 items-center justify-start gap-3 px-2 py-0">
        <etos-theme-switcher [userInfo]="profileInfo" [quickActions]="quickActions" popoverAlign="start" />

        <div class="min-w-0 flex flex-col gap-px">
          <span class="truncate text-sm font-semibold leading-none text-foreground">{{ profileName }}</span>
          <span class="truncate text-xs leading-none text-muted-foreground">{{ profileTitle }}</span>
        </div>
      </div>
    </ng-template>

    <etos-layout [sidebarFooterTemplate]="layoutPanel" [layoutBrandTemplate]="layoutBrand" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pages {
  protected readonly profileName = 'Ojie Permana';
  protected readonly profileTitle = 'Etos design system navigator';
  protected readonly profileInfo = {
    name: this.profileName,
    subtitle: this.profileTitle,
    avatarSrc: '/avatar-ojie.svg',
    avatarAlt: 'Portrait of Ojie Permana',
  } satisfies EtosThemeSwitcherUserInfo;

  protected readonly quickActions = [
    { value: 'notifications', label: 'Notifications', icon: 'notifications' },
    { value: 'sign-out', label: 'Logout', icon: 'logout', tone: 'destructive' },
  ] satisfies readonly EtosThemeSwitcherQuickAction[];
}
