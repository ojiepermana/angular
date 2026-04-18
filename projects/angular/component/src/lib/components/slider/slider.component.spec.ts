import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { SliderComponent } from './slider.component';

@Component({
  imports: [SliderComponent, FormsModule],
  template: `<input type="range" ui-slider [(ngModel)]="value" min="0" max="100" />`,
})
class Host {
  value = 30;
}

describe('SliderComponent', () => {
  it('applies ui-slider base classes to the range input', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type=range]') as HTMLInputElement;
    expect(input.className).toContain('ui-slider');
    expect(input.className).toContain('appearance-none');
  });

  it('integrates with ngModel via RangeValueAccessor', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type=range]') as HTMLInputElement;
    input.value = '77';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value).toBe(77);
  });
});
