import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutVerticalComponent } from './vertical';

@Component({
  imports: [LayoutVerticalComponent],
  template: `
    <vertical>
      <div navigation class="navigation-slot">Navigation</div>
    </vertical>
  `,
})
class VerticalShellTestComponent {}

describe('LayoutVerticalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalShellTestComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('marks the host as vertical and projects navigation content into the sidebar', () => {
    const fixture = TestBed.createComponent(VerticalShellTestComponent);

    fixture.detectChanges();

    const shell = fixture.nativeElement.querySelector('vertical') as HTMLElement;
    const projectedNavigation = fixture.nativeElement.querySelector(
      'aside .navigation-slot',
    ) as HTMLElement | null;

    expect(shell.getAttribute('data-layout-mode')).toBe('vertical');
    expect(projectedNavigation?.textContent?.trim()).toBe('Navigation');
    expect(fixture.nativeElement.querySelector('main')).not.toBeNull();
  });
});
