import { TestBed } from '@angular/core/testing';
import { NavigationService } from '@ojiepermana/angular/navigation';

import { appConfig, layoutConfig, themeConfig } from './app.config';
import { App } from './app';
import { AppNavigation } from './app.navigation';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['mode'];
    delete document.documentElement.dataset['color'];
    delete document.documentElement.dataset['style'];
    delete document.documentElement.dataset['theme'];

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [...appConfig.providers],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['mode'];
    delete document.documentElement.dataset['color'];
    delete document.documentElement.dataset['style'];
    delete document.documentElement.dataset['theme'];
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

  it('should apply configured theme defaults on bootstrap', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(document.documentElement.dataset['mode']).toBe(themeConfig.mode);
    expect(document.documentElement.dataset['color']).toBe(themeConfig.color);
    expect(document.documentElement.dataset['style']).toBe(themeConfig.style);
    expect(document.documentElement.dataset['theme']).toBe(themeConfig.color);
    expect(localStorage.getItem('theme-mode')).toBe(themeConfig.mode);
    expect(localStorage.getItem('theme-color')).toBe(themeConfig.color);
    expect(localStorage.getItem('theme-style')).toBe(themeConfig.style);
  });

  it('should apply configured layout defaults on bootstrap', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(localStorage.getItem('layout-mode')).toBe(layoutConfig.mode);
  });
});
