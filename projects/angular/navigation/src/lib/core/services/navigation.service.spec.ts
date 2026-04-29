import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { NavigationService } from './navigation.service';
import type { NavigationItem } from '../types/navigation.type';

const items: NavigationItem[] = [
  {
    id: 'root',
    type: 'group',
    title: 'Root',
    children: [
      {
        id: 'docs',
        type: 'collapsable',
        title: 'Docs',
        children: [
          { id: 'intro', type: 'basic', title: 'Intro', link: '/docs/intro' },
          { id: 'install', type: 'basic', title: 'Install', link: '/docs/install' },
        ],
      },
    ],
  },
];

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(NavigationService);
  });

  it('defaults sidebar appearance to default', () => {
    expect(service.sidebarAppearance()).toBe('default');
    expect(service.collapsed()).toBe(false);
  });

  it('toggles sidebar appearance and persists it', () => {
    service.toggleSidebarAppearance();

    expect(service.sidebarAppearance()).toBe('thin');
    expect(service.collapsed()).toBe(true);
    expect(localStorage.getItem('sidebar-appearance')).toBe('thin');

    service.setSidebarAppearance('default');

    expect(service.sidebarAppearance()).toBe('default');
    expect(service.collapsed()).toBe(false);
    expect(localStorage.getItem('sidebar-appearance')).toBe('default');
  });

  it('reads persisted sidebar appearance from localStorage', () => {
    localStorage.setItem('sidebar-appearance', 'thin');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    service = TestBed.inject(NavigationService);

    expect(service.sidebarAppearance()).toBe('thin');
    expect(service.collapsed()).toBe(true);
  });

  it('toggles group open state', () => {
    expect(service.isGroupOpen('docs')).toBe(false);
    service.toggleGroup('docs');
    expect(service.isGroupOpen('docs')).toBe(true);
    service.toggleGroup('docs');
    expect(service.isGroupOpen('docs')).toBe(false);
  });

  it('controls mobile open state', () => {
    expect(service.mobileOpen()).toBe(false);
    service.openMobile();
    expect(service.mobileOpen()).toBe(true);
    service.closeMobile();
    expect(service.mobileOpen()).toBe(false);
  });

  it('builds active trail from url', () => {
    service.registerItems(items);
    service.activeUrl.set('/docs/intro');
    const trail = service.activeTrail();
    expect(trail.has('intro')).toBe(true);
    expect(trail.has('docs')).toBe(true);
    expect(trail.has('root')).toBe(true);
  });

  it('registers items under named key without affecting main', () => {
    service.registerItems(items);
    service.registerItems('secondary', [{ id: 's1', type: 'basic', title: 'Sec', link: '/sec' }]);
    expect(service.items().length).toBe(1); // main untouched
    expect(service.getItems('secondary')().length).toBe(1);
  });

  it('builds active trail across all registries', () => {
    service.registerItems('other', [{ id: 'page', type: 'basic', title: 'Page', link: '/page' }]);
    service.activeUrl.set('/page');
    expect(service.activeTrail().has('page')).toBe(true);
  });

  it('removeItems cleans up a named registry', () => {
    service.registerItems('temp', [{ id: 't1', type: 'basic', title: 'Tmp', link: '/tmp' }]);
    expect(service.getItems('temp')().length).toBe(1);
    service.removeItems('temp');
    expect(service.getItems('temp')().length).toBe(0);
  });
});
