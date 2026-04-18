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
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(NavigationService);
  });

  it('toggles collapsed state', () => {
    expect(service.collapsed()).toBe(false);
    service.toggleCollapsed();
    expect(service.collapsed()).toBe(true);
    service.setCollapsed(false);
    expect(service.collapsed()).toBe(false);
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
});
