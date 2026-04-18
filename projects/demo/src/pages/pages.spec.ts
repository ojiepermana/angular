import { ComponentFixture, TestBed } from '@angular/core/testing';
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

    expect(fixture.nativeElement.querySelector('vertical')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('horizontal')).toBeNull();
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

    expect(horizontalFixture.nativeElement.querySelector('horizontal')).not.toBeNull();
    expect(horizontalFixture.nativeElement.querySelector('vertical')).toBeNull();
  });
});
