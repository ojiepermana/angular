import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  EtosLayoutComponent,
  type EtosThemeSwitcherNotificationShortcut,
  type EtosThemeSwitcherQuickAction,
  EtosThemeSwitcherComponent,
  type EtosThemeSwitcherUserInfo,
} from '@ojiepermana/angular/etos';

@Component({
  selector: 'app-pages',
  imports: [RouterLink, RouterOutlet, EtosLayoutComponent, EtosThemeSwitcherComponent],
  host: {
    class: 'block min-h-dvh bg-background text-foreground',
  },
  template: ` <etos-layout /> `,
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

  protected readonly notificationShortcut = {
    value: 'notifications',
    icon: 'notifications',
    ariaLabel: `Open notifications for ${this.profileName}`,
  } satisfies EtosThemeSwitcherNotificationShortcut;
}
