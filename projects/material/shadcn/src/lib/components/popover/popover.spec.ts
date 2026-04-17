import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PopoverContentDirective } from './popover-content.directive';
import { PopoverTriggerDirective } from './popover-trigger.directive';

@Component({
  imports: [PopoverTriggerDirective, PopoverContentDirective],
  template: `
    <button [uiPopoverTrigger]="pop">Open</button>
    <ng-template uiPopoverContent #pop="uiPopoverContent">
      <div class="ui-test-popover-body">Hello</div>
    </ng-template>
  `,
})
class Host {}

describe('PopoverTriggerDirective', () => {
  it('sets aria-haspopup/aria-expanded on the trigger', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the popover template and flips aria-expanded on click', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.querySelector('.ui-test-popover-body')).toBeTruthy();
    // Cleanup: click again to close.
    btn.click();
    fixture.detectChanges();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });
});
