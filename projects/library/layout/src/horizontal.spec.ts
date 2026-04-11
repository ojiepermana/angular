import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutHorizontalComponent } from './horizontal';

@Component({
  imports: [LayoutHorizontalComponent],
  template: `
    <horizontal>
      <div headerBrand class="brand-slot">Brand</div>
      <div headerNavigation class="navigation-slot">Navigation</div>
      <div headerActions class="actions-slot">Actions</div>
    </horizontal>
  `,
})
class HorizontalShellTestComponent {}

describe('LayoutHorizontalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalShellTestComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('marks the host as horizontal and projects header content into the expected slots', () => {
    const fixture = TestBed.createComponent(HorizontalShellTestComponent);

    fixture.detectChanges();

    const shell = fixture.nativeElement.querySelector('horizontal') as HTMLElement;
    const brand = fixture.nativeElement.querySelector('brand .brand-slot') as HTMLElement | null;
    const navigation = fixture.nativeElement.querySelector(
      'header nav .navigation-slot',
    ) as HTMLElement | null;
    const actions = fixture.nativeElement.querySelector(
      'panel .actions-slot',
    ) as HTMLElement | null;

    expect(shell.getAttribute('data-layout-mode')).toBe('horizontal');
    expect(brand?.textContent?.trim()).toBe('Brand');
    expect(navigation?.textContent?.trim()).toBe('Navigation');
    expect(actions?.textContent?.trim()).toBe('Actions');
    expect(fixture.nativeElement.querySelector('main')).not.toBeNull();
  });
});
