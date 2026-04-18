import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SheetComponent } from './sheet.component';

@Component({
  imports: [SheetComponent],
  template: `
    <ui-sheet [(open)]="open" [side]="side" aria-labelledby="st">
      <h2 id="st">Panel</h2>
    </ui-sheet>
  `,
})
class Host {
  open = false;
  side: 'top' | 'bottom' | 'left' | 'right' = 'right';
}

describe('SheetComponent', () => {
  it('attaches a role=dialog surface with side-specific classes when opened', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const surface = document.body.querySelector('.ui-sheet-surface') as HTMLElement | null;
    expect(surface).toBeTruthy();
    expect(surface!.getAttribute('role')).toBe('dialog');
    expect(surface!.getAttribute('aria-modal')).toBe('true');
    expect(surface!.className).toContain('right-0');
    fixture.destroy();
  });

  it('left side uses the left-0 edge class', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.side = 'left';
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const surface = document.body.querySelector('.ui-sheet-surface') as HTMLElement;
    expect(surface.className).toContain('left-0');
    fixture.destroy();
  });
});
