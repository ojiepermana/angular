import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EtosThemeSwitcherComponent } from '@ojiepermana/angular/etos';
import { provideMaterialLayout } from '@ojiepermana/angular/layout';
import { provideRouter } from '@angular/router';

import { Pages } from './pages';

describe('Pages', () => {
  let component: Pages;
  let fixture: ComponentFixture<Pages>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Pages],
      providers: [provideRouter([]), provideMaterialLayout({ mode: 'vertical' })],
    }).compileComponents();

    fixture = TestBed.createComponent(Pages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the vertical layout by default', () => {
    fixture.detectChanges();

    const themeSwitcher = fixture.debugElement.query(By.directive(EtosThemeSwitcherComponent))
      .componentInstance as EtosThemeSwitcherComponent;

    expect(fixture.nativeElement.querySelector('etos-vertical-layout')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('etos-horizontal-layout')).toBeNull();
    expect(fixture.nativeElement.querySelector('etos-theme-switcher')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[ui-sidebar-footer]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('etos-theme-switcher img[src="/avatar-ojie.svg"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[ui-sidebar-footer]')?.textContent).toContain('Ojie Permana');
    expect(fixture.nativeElement.querySelector('[ui-sidebar-footer]')?.textContent).toContain(
      'Etos design system navigator',
    );
    expect(fixture.nativeElement.querySelector('etos-theme-switcher [data-trigger-action="notifications"]')).toBeNull();
    expect(themeSwitcher.popoverAlign()).toBe('start');
  });

  it('should render the horizontal layout from persisted mode', async () => {
    localStorage.setItem('layout-mode', 'horizontal');

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [Pages],
        providers: [provideRouter([]), provideMaterialLayout({ mode: 'vertical' })],
      })
      .compileComponents();

    const horizontalFixture = TestBed.createComponent(Pages);
    horizontalFixture.detectChanges();

    expect(horizontalFixture.nativeElement.querySelector('etos-horizontal-layout')).not.toBeNull();
    expect(horizontalFixture.nativeElement.querySelector('etos-vertical-layout')).toBeNull();
    expect(horizontalFixture.nativeElement.querySelector('etos-theme-switcher')).not.toBeNull();
    expect(horizontalFixture.nativeElement.querySelector('[ui-layout-profile]')).not.toBeNull();
    expect(
      horizontalFixture.nativeElement.querySelector('etos-theme-switcher img[src="/avatar-ojie.svg"]'),
    ).not.toBeNull();
    expect(
      horizontalFixture.nativeElement.querySelector('etos-theme-switcher [data-trigger-action="notifications"]'),
    ).not.toBeNull();
  });
});
