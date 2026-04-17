import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TabsTriggerComponent,
} from './tabs.component';

@Component({
  imports: [TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent],
  template: `
    <ui-tabs [(value)]="tab">
      <ui-tabs-list>
        <button ui-tabs-trigger value="a">A</button>
        <button ui-tabs-trigger value="b">B</button>
      </ui-tabs-list>
      <ui-tabs-content value="a">panel A</ui-tabs-content>
      <ui-tabs-content value="b">panel B</ui-tabs-content>
    </ui-tabs>
  `,
})
class Host {
  tab: string | null = 'a';
}

describe('Tabs primitives', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('activates the first trigger based on the bound value', () => {
    const fixture = render();
    const first = fixture.nativeElement.querySelector(
      'button[ui-tabs-trigger]',
    ) as HTMLButtonElement;
    expect(first.getAttribute('aria-selected')).toBe('true');
    expect(first.getAttribute('data-state')).toBe('active');
  });

  it('tablist has role=tablist and orientation', () => {
    const fixture = render();
    const list = fixture.nativeElement.querySelector('ui-tabs-list') as HTMLElement;
    expect(list.getAttribute('role')).toBe('tablist');
    expect(list.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('clicking a trigger activates the matching content panel', () => {
    const fixture = render();
    const triggers = fixture.nativeElement.querySelectorAll(
      'button[ui-tabs-trigger]',
    ) as NodeListOf<HTMLButtonElement>;
    triggers[1].click();
    fixture.detectChanges();
    expect(triggers[1].getAttribute('aria-selected')).toBe('true');
    const panels = fixture.nativeElement.querySelectorAll('ui-tabs-content');
    expect((panels[0] as HTMLElement).hasAttribute('hidden')).toBe(true);
    expect((panels[1] as HTMLElement).hasAttribute('hidden')).toBe(false);
  });

  it('ArrowRight moves focus/selection to the next trigger', () => {
    const fixture = render();
    const triggers = fixture.nativeElement.querySelectorAll(
      'button[ui-tabs-trigger]',
    ) as NodeListOf<HTMLButtonElement>;
    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(triggers[1].getAttribute('aria-selected')).toBe('true');
  });
});
