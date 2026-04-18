import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { NavigationService } from '../../core/services/navigation.service';
import type { NavigationItem } from '../../core/types/navigation.type';
import { UiNavItemComponent } from './nav-item.component';

@Component({ template: '' })
class DummyRouteComponent {}

const docsItem: NavigationItem = {
  id: 'docs',
  type: 'collapsable',
  title: 'Docs',
  children: [{ id: 'intro', type: 'basic', title: 'Intro', link: '/docs/intro' }],
};

@Component({
  imports: [UiNavItemComponent],
  template: `<ui-nav-item [item]="item" />`,
})
class HostComponent {
  item: NavigationItem = docsItem;
}

describe('UiNavItemComponent', () => {
  async function setup(item: NavigationItem) {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'docs/:slug', component: DummyRouteComponent }])],
    });

    const nav = TestBed.inject(NavigationService);
    nav.registerItems([{ id: 'root', type: 'group', title: 'Root', children: [docsItem] }]);

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/docs/intro');

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.item = item;
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('reopens the active trail for collapsable items after navigation', async () => {
    const fixture = await setup(docsItem);
    const host: HTMLElement = fixture.nativeElement;
    const panel = host.querySelector('[role="region"]');
    const button = host.querySelector('button');

    expect(panel?.textContent).toContain('Intro');
    expect(button?.className).toContain('text-primary');
    expect(button?.className).not.toContain('bg-accent/50');
  });

  it('marks active links with the primary text color', async () => {
    const fixture = await setup({ id: 'intro', type: 'basic', title: 'Intro', link: '/docs/intro' });
    const host: HTMLElement = fixture.nativeElement;
    const anchor = host.querySelector('a');

    expect(anchor?.getAttribute('aria-current')).toBe('page');
    expect(anchor?.className).toContain('text-primary');
    expect(anchor?.className).not.toContain('bg-accent/50');
  });
});
