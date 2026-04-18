import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MenuContentDirective, MenuSurfaceComponent } from '../dropdown-menu/menu-surface.component';
import { MenuItemComponent } from '../dropdown-menu/menu-item.component';
import { ContextMenuTriggerDirective } from './context-menu-trigger.directive';

@Component({
  imports: [ContextMenuTriggerDirective, MenuContentDirective, MenuSurfaceComponent, MenuItemComponent],
  template: `
    <div class="trigger" [uiContextMenuTrigger]="m">Area</div>
    <ng-template uiMenuContent #m="uiMenuContent">
      <ui-menu-surface>
        <button ui-menu-item class="ui-test-ctx">Copy</button>
      </ui-menu-surface>
    </ng-template>
  `,
})
class Host {}

describe('ContextMenuTrigger', () => {
  it('opens a menu surface in response to a contextmenu event', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const target = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 20, clientY: 20, cancelable: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    const surface = document.body.querySelector('[role=menu]') as HTMLElement | null;
    expect(surface).toBeTruthy();
    expect(surface!.querySelector('.ui-test-ctx')).toBeTruthy();
    fixture.destroy();
  });
});
