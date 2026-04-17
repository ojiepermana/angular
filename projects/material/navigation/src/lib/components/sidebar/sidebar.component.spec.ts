import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { SidebarComponent } from './sidebar.component';
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
  template: `<ui-sidebar [items]="items" [appearance]="appearance" [autoMobile]="false" />`,
})
class Host {
  items = items;
  appearance: 'default' | 'thin' = 'default';
}

describe('SidebarComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders items with default appearance', () => {
    const fixture = setup();
    const host: HTMLElement = fixture.nativeElement.querySelector('ui-sidebar');
    expect(host.getAttribute('data-appearance')).toBe('default');
    expect(host.getAttribute('role')).toBe('navigation');
    expect(host.querySelectorAll('ui-nav-item').length).toBeGreaterThan(0);
    expect(host.textContent).toContain('Home');
    expect(host.textContent).not.toContain('Hidden subtitle');
  });

  it('adds vertical padding to groups for clearer spacing', () => {
    const fixture = setup();
    const host: HTMLElement = fixture.nativeElement.querySelector('ui-sidebar');
    const group = host.querySelector('[role="group"]') as HTMLElement | null;
    const groupedChildren = host.querySelector('[role="group"] > div.flex.flex-col') as HTMLElement | null;

    expect(group?.classList.contains('py-3')).toBe(true);
    expect(groupedChildren?.classList.contains('py-3')).toBe(false);
  });

  it('switches to thin appearance', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.appearance = 'thin';
    fixture.detectChanges();
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('ui-sidebar');
    expect(host.getAttribute('data-appearance')).toBe('thin');
  });
});
