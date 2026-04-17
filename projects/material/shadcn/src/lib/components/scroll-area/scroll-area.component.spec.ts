import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ScrollAreaComponent } from './scroll-area.component';

@Component({
  imports: [ScrollAreaComponent],
  template: `<ui-scroll-area class="h-40 w-32">Body</ui-scroll-area>`,
})
class Host {}

describe('ScrollAreaComponent', () => {
  it('renders a scrollable viewport with base styling', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('ui-scroll-area') as HTMLElement;
    expect(host.className).toContain('overflow-hidden');
    expect(host.className).toContain('h-40');
    const viewport = host.querySelector('.ui-scroll-area-viewport') as HTMLElement;
    expect(viewport).toBeTruthy();
    expect(viewport.textContent).toContain('Body');
  });
});
