import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { TopbarComponent } from './topbar.component';
import type { NavigationItem } from '../../core/types/navigation.type';

const items: NavigationItem[] = [
  { id: 'home', type: 'basic', title: 'Home', link: '/home' },
  {
    id: 'products',
    type: 'collapsable',
    title: 'Products',
    children: [
      { id: 'a', type: 'basic', title: 'A', link: '/a' },
      { id: 'b', type: 'basic', title: 'B', link: '/b' },
    ],
  },
  {
    id: 'library',
    type: 'group',
    title: 'Library',
    children: [{ id: 'c', type: 'basic', title: 'C', link: '/c' }],
  },
];

@Component({
  imports: [TopbarComponent],
  template: `
    <topbar [items]="items" [appearance]="appearance">
      <a topbar-start href="/brand">Brand</a>
      <button topbar-end type="button">Profile</button>
    </topbar>
  `,
})
class Host {
  items = items;
  appearance: 'default' = 'default';
}

describe('TopbarComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders menubar with items', () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;
    const menubar = el.querySelector('[role="menubar"]');
    expect(menubar).toBeTruthy();
    const items = Array.from(el.querySelectorAll('[role="menuitem"]'));
    expect(items.length).toBe(3);
    expect(items.every((item) => !item.className.includes('text-sm'))).toBe(true);
    expect(items.every((item) => item.className.includes('ui-nav-text'))).toBe(true);
  });

  it('renders brand and profile in dedicated topbar slots', () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('[data-topbar-slot="start"]')?.textContent).toContain('Brand');
    expect(el.querySelector('[data-topbar-slot="nav"] [role="menubar"]')).toBeTruthy();
    expect(el.querySelector('[data-topbar-slot="end"]')?.textContent).toContain('Profile');
  });

  it('uses the h-11 topbar height', () => {
    const fixture = setup();
    const topbar = (fixture.nativeElement as HTMLElement).querySelector('topbar') as HTMLElement | null;
    const inner = topbar?.firstElementChild as HTMLElement | null;

    expect(topbar?.classList.contains('h-11')).toBe(true);
    expect(inner?.classList.contains('h-full')).toBe(true);
    expect(inner?.classList.contains('h-14')).toBe(false);
  });

  it('opens dropdown overlay on collapsable click', async () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;
    const triggers = el.querySelectorAll('button[role="menuitem"]');
    const productsTrigger = triggers[0] as HTMLButtonElement;
    productsTrigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(productsTrigger.getAttribute('aria-expanded')).toBe('true');
    const panel = document.querySelector('.ui-dropdown-panel');
    expect(panel).toBeTruthy();
  });

  it('opens dropdown overlay on group click', async () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;
    const triggers = el.querySelectorAll('button[role="menuitem"]');
    const groupTrigger = triggers[1] as HTMLButtonElement;
    groupTrigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(groupTrigger.getAttribute('aria-expanded')).toBe('true');
    const panel = document.querySelector('.ui-dropdown-panel');
    expect(panel).toBeTruthy();
    expect(panel?.textContent).toContain('C');
  });
});
