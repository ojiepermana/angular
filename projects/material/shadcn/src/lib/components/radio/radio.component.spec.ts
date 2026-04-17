import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { RadioComponent, RadioGroupComponent } from './radio.component';

@Component({
  imports: [RadioGroupComponent, RadioComponent, FormsModule],
  template: `
    <ui-radio-group name="plan" [(ngModel)]="plan" [orientation]="orient">
      <ui-radio value="free">Free</ui-radio>
      <ui-radio value="pro">Pro</ui-radio>
    </ui-radio-group>
  `,
})
class Host {
  plan: string | null = 'free';
  orient: 'horizontal' | 'vertical' = 'vertical';
}

describe('Radio primitives', () => {
  it('renders group host with grid classes', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('mat-radio-group') as HTMLElement;
    expect(group.className).toContain('ui-radio-group');
    expect(group.className).toContain('grid');
  });

  it('switches to horizontal flow classes when orientation=horizontal', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.orient = 'horizontal';
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('mat-radio-group') as HTMLElement;
    expect(group.className).toContain('grid-flow-col');
  });

  it('renders both radios with their labels', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Free');
    expect(text).toContain('Pro');
  });
});
