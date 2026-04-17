import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MenuContentDirective, MenuSurfaceComponent } from './menu-surface.component';
import { MenuItemComponent, MenuSeparatorComponent } from './menu-item.component';
import { MenuTriggerDirective } from './menu-trigger.directive';

@Component({
  imports: [
    MenuTriggerDirective,
    MenuContentDirective,
    MenuSurfaceComponent,
    MenuItemComponent,
    MenuSeparatorComponent,
  ],
  template: `
    <button [uiMenuTrigger]="m" side="bottom" align="start">Open</button>
    <ng-template uiMenuContent #m="uiMenuContent">
      <ui-menu-surface>
        <button ui-menu-item class="ui-test-item">A</button>
        <ui-menu-separator />
        <button ui-menu-item>B</button>
      </ui-menu-surface>
    </ng-template>
  `,
})
class Host {}

describe('DropdownMenu', () => {
  it('sets aria-haspopup=menu and aria-expanded=false by default', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-haspopup')).toBe('menu');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens a role=menu surface with items on click', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const surface = document.body.querySelector('[role=menu]') as HTMLElement | null;
    expect(surface).toBeTruthy();
    expect(surface!.querySelector('.ui-test-item')).toBeTruthy();
    expect(surface!.querySelector('[role=separator]')).toBeTruthy();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });
});
