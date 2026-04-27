import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MATERIAL_LAYOUT_CONFIG, LayoutService } from '@ojiepermana/angular/layout';
import { MATERIAL_THEME_CONFIG, ThemeService } from '@ojiepermana/angular/theme';
import { EtosThemeSwitcherComponent } from './theme-switcher.component';

describe('EtosThemeSwitcherComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['mode'];
    delete document.documentElement.dataset['color'];
    delete document.documentElement.dataset['style'];
    delete document.documentElement.dataset['theme'];
    document.documentElement.removeAttribute('theme-brand');
    document.documentElement.removeAttribute('theme-color');
    document.documentElement.removeAttribute('theme-style');
    document.querySelectorAll('.cdk-overlay-container').forEach((node) => node.remove());

    await TestBed.configureTestingModule({
      imports: [EtosThemeSwitcherComponent],
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            mode: 'light',
            brand: 'etos',
            color: 'blue',
            style: 'default',
            modeStorageKey: 'theme-mode',
            brandStorageKey: 'theme-brand',
            colorStorageKey: 'theme-color',
            styleStorageKey: 'theme-style',
          },
        },
        {
          provide: MATERIAL_LAYOUT_CONFIG,
          useValue: {
            mode: 'vertical',
            width: 'fixed',
            storageKey: 'layout-mode',
            widthStorageKey: 'layout-width',
          },
        },
      ],
    }).compileComponents();
  });

  it('renders initials in the trigger fallback when no avatar is provided', () => {
    const fixture = TestBed.createComponent(EtosThemeSwitcherComponent);
    fixture.componentRef.setInput('userName', 'Ojie Permana');
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector('ui-avatar-fallback') as HTMLElement | null;

    expect(fallback?.textContent).toContain('OP');
  });

  it('renders the avatar image when a photo is provided', () => {
    const fixture = TestBed.createComponent(EtosThemeSwitcherComponent);
    fixture.componentRef.setInput('userName', 'Ojie Permana');
    fixture.componentRef.setInput('avatarSrc', 'https://example.test/avatar.png');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('ui-avatar-image img') as HTMLImageElement | null;

    expect(image?.getAttribute('src')).toBe('https://example.test/avatar.png');
    expect(image?.getAttribute('alt')).toBe('Ojie Permana avatar');
  });

  it('opens the popover and updates theme and layout preferences', async () => {
    const fixture = TestBed.createComponent(EtosThemeSwitcherComponent);
    fixture.componentRef.setInput('userName', 'Ojie Permana');
    fixture.componentRef.setInput('userSubtitle', 'Platform design system');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = document.body.querySelector('[data-etos-theme-switcher-panel]') as HTMLElement | null;
    const theme = TestBed.inject(ThemeService);
    const layout = TestBed.inject(LayoutService);

    expect(panel?.textContent).toContain('Platform design system');
    expect(panel?.textContent).toContain('Light');
    expect(panel?.textContent).toContain('Dark');
    expect(panel?.textContent).toContain('System');
    expect(panel?.textContent).toContain('Layout');
    expect(panel?.textContent).toContain('Width');
    expect((panel?.querySelector('[data-setting="layout-mode"]') as HTMLElement | null)?.textContent).toContain(
      'Horizontal',
    );
    expect((panel?.querySelector('[data-setting="layout-mode"]') as HTMLElement | null)?.textContent).toContain(
      'Vertical',
    );
    expect((panel?.querySelector('[data-setting="layout-width"]') as HTMLElement | null)?.textContent).toContain(
      'Full',
    );
    expect((panel?.querySelector('[data-setting="layout-width"]') as HTMLElement | null)?.textContent).toContain(
      'Fixed',
    );
    expect(panel?.textContent).toContain('Notifications');
    expect(panel?.textContent).toContain('Logout');
    expect(panel?.textContent).not.toContain('Profile');
    expect(panel?.textContent).not.toContain('Settings');

    (
      panel?.querySelector('[data-setting-option="theme-scheme"][data-value="dark"]') as HTMLButtonElement | null
    )?.click();
    (
      panel?.querySelector('[data-setting-option="layout-mode"][data-value="horizontal"]') as HTMLButtonElement | null
    )?.click();
    (
      panel?.querySelector('[data-setting-option="layout-width"][data-value="full"]') as HTMLButtonElement | null
    )?.click();

    fixture.detectChanges();
    TestBed.flushEffects();
    await fixture.whenStable();

    expect(theme.scheme()).toBe('dark');
    expect(theme.mode()).toBe('dark');
    expect(layout.mode()).toBe('horizontal');
    expect(layout.width()).toBe('full');
    expect(localStorage.getItem('theme-mode')).toBe('dark');
    expect(localStorage.getItem('layout-mode')).toBe('horizontal');
    expect(localStorage.getItem('layout-width')).toBe('full');
    expect(
      (panel?.querySelector('[data-setting="layout-mode"]') as HTMLElement | null)?.getAttribute('data-current'),
    ).toBe('horizontal');
    expect(
      (panel?.querySelector('[data-setting="layout-width"]') as HTMLElement | null)?.getAttribute('data-current'),
    ).toBe('full');
  });

  it('emits the selected quick action and closes the panel', async () => {
    const fixture = TestBed.createComponent(EtosThemeSwitcherComponent);
    const selected: string[] = [];

    fixture.componentInstance.actionSelected.subscribe((action) => selected.push(action));
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = document.body.querySelector('[data-etos-theme-switcher-panel]') as HTMLElement | null;
    const signOutButton = panel?.querySelector(
      '[data-action-option][data-value="sign-out"]',
    ) as HTMLButtonElement | null;

    signOutButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(selected).toEqual(['sign-out']);
    expect(document.body.querySelector('[data-etos-theme-switcher-panel]')).toBeNull();
  });

  it('renders a notification shortcut outside the popup and removes notifications from quick actions', async () => {
    const fixture = TestBed.createComponent(EtosThemeSwitcherComponent);
    const selected: string[] = [];

    fixture.componentRef.setInput('userName', 'Ojie Permana');
    fixture.componentRef.setInput('showNotificationShortcut', true);
    fixture.componentInstance.actionSelected.subscribe((action) => selected.push(action));
    fixture.detectChanges();

    const notificationButton = fixture.nativeElement.querySelector(
      '[data-trigger-action="notifications"]',
    ) as HTMLButtonElement | null;
    const trigger = fixture.nativeElement.querySelector(
      'button[aria-label="Open user info for Ojie Permana"]',
    ) as HTMLButtonElement | null;

    expect(notificationButton).not.toBeNull();
    expect(notificationButton?.className).toContain('h-8');

    notificationButton?.click();
    fixture.detectChanges();

    expect(selected).toEqual(['notifications']);

    trigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = document.body.querySelector('[data-etos-theme-switcher-panel]') as HTMLElement | null;

    expect(panel?.querySelector('[data-action-option][data-value="notifications"]')).toBeNull();
  });
});
