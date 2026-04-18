import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TooltipDirective } from './tooltip.directive';

@Component({
  imports: [TooltipDirective],
  template: `<button [uiTooltip]="msg" uiTooltipPosition="above">Save</button>`,
})
class Host {
  msg = 'Save changes';
}

describe('TooltipDirective', () => {
  it('renders the host button unchanged and survives binding', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Save');
  });
});
