import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { SidebarComponent } from './sidebar.component';
import { NavigationService } from '../../core/services/navigation.service';
import type { NavigationItem } from '../../core/types/navigation.type';

const items: NavigationItem[] = [
  {
    id: 'g1',
    type: 'group',
    title: 'Group 1',
    subtitle: 'Hidden subtitle',
    children: [
      { id: 'home', type: 'basic', title: 'Home', icon: 'home', link: '/home' },
      { id: 'about', type: 'basic', title: 'About', icon: 'info', link: '/about' },
    ],
  },
];

@Component({
  imports: [SidebarComponent],
  template: `<sidebar [items]="items" [appearance]="appearance" [autoMobile]="autoMobile" />`,
})
class Host {
  items = items;
  appearance: 'default' | 'thin' = 'default';
  autoMobile = false;
}

describe('SidebarComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    document.querySelectorAll('.cdk-overlay-container').forEach((node) => node.remove());
    TestBed.resetTestingModule();
  });

  function setup(options: { appearance?: 'default' | 'thin'; autoMobile?: boolean; mobileBreakpoint?: boolean } = {}) {
    const mobileBreakpoint = options.mobileBreakpoint ?? false;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: BreakpointObserver,
          useValue: {
            observe: () =>
              of({
                matches: mobileBreakpoint,
                breakpoints: { '(max-width: 767.98px)': mobileBreakpoint },
              }),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.appearance = options.appearance ?? 'default';
    fixture.componentInstance.autoMobile = options.autoMobile ?? false;
    fixture.detectChanges();
    return fixture;
  }

  it('renders items with default appearance', () => {
    const fixture = setup();
    const host: HTMLElement = fixture.nativeElement.querySelector('sidebar');
    const scrollArea = host.querySelector('ui-scroll-area') as HTMLElement | null;
    expect(host.getAttribute('data-appearance')).toBe('default');
    expect(host.getAttribute('role')).toBe('navigation');
    expect(scrollArea).not.toBeNull();
    expect(scrollArea?.classList.contains('flex-1')).toBe(true);
    expect(scrollArea?.querySelector('nav')).not.toBeNull();
    expect(host.querySelectorAll('ui-nav-item').length).toBeGreaterThan(0);
    expect(host.textContent).toContain('Home');
    expect(host.textContent).not.toContain('Hidden subtitle');
  });

  it('adds vertical padding to groups for clearer spacing', () => {
    const fixture = setup();
    const host: HTMLElement = fixture.nativeElement.querySelector('sidebar');
    const group = host.querySelector('[role="group"]') as HTMLElement | null;
    const groupHeader = host.querySelector('[role="group"] > div.sticky') as HTMLElement | null;
    const groupedChildren = host.querySelector('[role="group"] > div.flex.flex-col') as HTMLElement | null;

    expect(groupHeader?.classList.contains('p-3')).toBe(true);
    expect(group?.classList.contains('p-3')).toBe(false);
    expect(group?.classList.contains('py-3')).toBe(false);
    expect(groupedChildren?.classList.contains('py-3')).toBe(false);
  });

  it('switches to thin appearance', async () => {
    const fixture = setup({ appearance: 'thin' });
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sidebar');
    expect(host.getAttribute('data-appearance')).toBe('thin');
  });

  it('prefers stored collapsed state over the appearance input', async () => {
    const fixture = setup();
    TestBed.inject(NavigationService).setCollapsed(true);
    TestBed.flushEffects();
    fixture.detectChanges();
    await fixture.whenStable();

    const host: HTMLElement = fixture.nativeElement.querySelector('sidebar');
    expect(host.getAttribute('data-appearance')).toBe('thin');
  });

  it('expands the thin sidebar on hover without changing its collapsed appearance', async () => {
    const fixture = setup({ appearance: 'thin' });
    const host: HTMLElement = fixture.nativeElement.querySelector('sidebar');
    const inner = host.firstElementChild as HTMLElement | null;

    expect(host.getAttribute('data-appearance')).toBe('thin');
    expect(host.getAttribute('data-expanded')).toBe('false');
    expect(inner?.className).not.toContain('absolute');

    host.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.getAttribute('data-appearance')).toBe('thin');
    expect(host.getAttribute('data-expanded')).toBe('true');
    expect(inner?.className).toContain('absolute');
    expect(inner?.className).toContain('[width:17.5rem]');
    expect(host.querySelector('ui-scroll-area')).not.toBeNull();

    host.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.getAttribute('data-appearance')).toBe('thin');
    expect(host.getAttribute('data-expanded')).toBe('false');
    expect(inner?.className).not.toContain('absolute');
  });

  it('renders the shared scroll body inside the mobile drawer overlay', async () => {
    const fixture = setup({ autoMobile: true, mobileBreakpoint: true });
    const nav = TestBed.inject(NavigationService);
    const host: HTMLElement = fixture.nativeElement.querySelector('sidebar');

    expect(host.hasAttribute('hidden')).toBe(true);

    nav.openMobile();
    TestBed.flushEffects();
    fixture.detectChanges();
    await fixture.whenStable();

    const drawer = document.body.querySelector('.sidebar-drawer [role="dialog"]') as HTMLElement | null;
    const drawerScrollArea = drawer?.querySelector('ui-scroll-area') as HTMLElement | null;

    expect(drawer).not.toBeNull();
    expect(drawer?.getAttribute('aria-label')).toBe('Primary');
    expect(drawerScrollArea).not.toBeNull();
    expect(drawerScrollArea?.classList.contains('flex-1')).toBe(true);
    expect(drawerScrollArea?.querySelector('nav')).not.toBeNull();

    nav.closeMobile();
    TestBed.flushEffects();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.body.querySelector('.sidebar-drawer [role="dialog"]')).toBeNull();
  });
});
