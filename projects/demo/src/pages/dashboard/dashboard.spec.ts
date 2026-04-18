import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMaterialLayout } from '@ojiepermana/angular/layout';

import { DashboardPage } from './dashboard';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideMaterialLayout({ mode: 'vertical' })],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a scrollable content area between header and footer', () => {
    const root = fixture.nativeElement as HTMLElement;
    const main = root.querySelector('main');
    const footer = root.querySelector('footer');

    expect(main?.className).toContain('flex-1');
    expect(main?.className).toContain('overflow-auto');
    expect(footer?.className).toContain('shrink-0');
  });

  it('should render the vertical dashboard shell by default', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-dashboard-layout="vertical"]')).toBeTruthy();
    expect(root.querySelector('[data-dashboard-layout="horizontal"]')).toBeNull();
  });

  it('should render the non-vertical dashboard shell when horizontal mode is active', async () => {
    localStorage.setItem('layout-mode', 'horizontal');

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [DashboardPage],
        providers: [provideMaterialLayout({ mode: 'vertical' })],
      })
      .compileComponents();

    const horizontalFixture = TestBed.createComponent(DashboardPage);
    horizontalFixture.detectChanges();

    const root = horizontalFixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-dashboard-layout="horizontal"]')).toBeTruthy();
    expect(root.querySelector('[data-dashboard-layout="vertical"]')).toBeNull();
  });
});
