import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MATERIAL_LAYOUT_CONFIG } from '@ojiepermana/angular/layout';

import { VerticalLayout } from './vertical';

describe('VerticalLayout', () => {
  let component: VerticalLayout;
  let fixture: ComponentFixture<VerticalLayout>;

  beforeEach(() => {
    localStorage.removeItem('layout-mode');
    localStorage.removeItem('layout-width');
    localStorage.removeItem('sidebar-collapse');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the shell width fixed in wide mode when the sidebar is collapsed', async () => {
    localStorage.setItem('sidebar-collapse', 'true');
    localStorage.removeItem('layout-width');

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [VerticalLayout],
        providers: [
          provideRouter([]),
          { provide: MATERIAL_LAYOUT_CONFIG, useValue: { width: 'wide', widthStorageKey: null } },
        ],
      })
      .compileComponents();

    const wideFixture = TestBed.createComponent(VerticalLayout);

    wideFixture.detectChanges();
    await wideFixture.whenStable();

    const wideComponent = wideFixture.componentInstance as unknown as {
      readonly layoutWidth: () => string;
      readonly shellClasses: () => string;
      readonly frameClasses: () => string;
      readonly frameBodyClasses: () => string;
      readonly gridClasses: () => string;
    };
    const host = wideFixture.nativeElement as HTMLElement;
    const sidebar = host.querySelector('sidebar') as HTMLElement | null;

    expect(wideComponent.layoutWidth()).toBe('wide');
    expect(wideComponent.shellClasses()).toContain('lg:py-10');
    expect(wideComponent.shellClasses()).not.toContain('lg:px-10');
    expect(wideComponent.frameClasses()).not.toContain('-mx-18');
    expect(wideComponent.frameBodyClasses()).toContain('h-full');
    expect(wideComponent.frameBodyClasses()).toContain('lg:px-10');
    expect(wideComponent.gridClasses()).toContain('w-full');
    expect(wideComponent.gridClasses()).not.toContain('w-fit');
    expect(wideComponent.gridClasses()).toContain('grid-cols-[auto_minmax(0,1fr)]');
    expect(wideComponent.gridClasses()).not.toContain('lg:max-w-[var(--etos-layout-vertical-shell-max-width-wide)]');
    expect(sidebar?.classList.contains('w-16')).toBe(true);
  });
});
