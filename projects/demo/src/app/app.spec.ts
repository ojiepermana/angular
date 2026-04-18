import { TestBed } from '@angular/core/testing';
import { NavigationService } from '@ojiepermana/angular/navigation';
import { ThemeService } from '@ojiepermana/angular/theme';

import { appConfig, themeConfig } from './app.config';
import { App } from './app';
import { AppNavigation } from './app.navigation';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [...appConfig.providers],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should register demo navigation data', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const navigation = TestBed.inject(NavigationService);
    expect(navigation.items()).toEqual(AppNavigation);
  });

  it('should apply configured theme defaults', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const theme = TestBed.inject(ThemeService);

    expect(theme.scheme()).toBe(themeConfig.mode);
    expect(theme.color()).toBe(themeConfig.color);
    expect(theme.style()).toBe(themeConfig.style);
    expect(localStorage.getItem('theme-mode')).toBe(themeConfig.mode);
    expect(localStorage.getItem('theme-color')).toBe(themeConfig.color);
    expect(localStorage.getItem('theme-style')).toBe(themeConfig.style);
  });
});
