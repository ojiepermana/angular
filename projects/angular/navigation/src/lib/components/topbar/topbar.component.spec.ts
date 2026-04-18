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
  {
    id: 'solutions',
    type: 'mega',
    title: 'Solutions',
    columns: 3,
    children: [
      {
        id: 'col-1',
        type: 'group',
        title: 'Column 1',
        children: [{ id: 's1', type: 'basic', title: 'Item 1', link: '/s1' }],
      },
    ],
  },
];

@Component({
  imports: [TopbarComponent],
  template: `
    <ui-topbar [items]="items" [appearance]="appearance">
      <a ui-topbar-start href="/brand">Brand</a>
      <button ui-topbar-end type="button">Profile</button>
    </ui-topbar>
  `,
})
class Host {
  items = items;
  appearance: 'default' | 'megamenu' = 'megamenu';
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
    const items = el.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(4);
  });

  it('renders brand and profile in dedicated topbar slots', () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('[data-ui-topbar-slot="start"]')?.textContent).toContain('Brand');
    expect(el.querySelector('[data-ui-topbar-slot="nav"] [role="menubar"]')).toBeTruthy();
    expect(el.querySelector('[data-ui-topbar-slot="end"]')?.textContent).toContain('Profile');
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

  it('opens mega overlay with columns', async () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;
    const triggers = el.querySelectorAll('button[role="menuitem"]');
    const megaTrigger = triggers[2] as HTMLButtonElement;
    megaTrigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(megaTrigger.getAttribute('aria-expanded')).toBe('true');
    const panel = document.querySelector('.ui-mega-panel');
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
