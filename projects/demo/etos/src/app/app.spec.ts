import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavigationService } from '@ojiepermana/angular/navigation';

import { appConfig, etosBrandConfig } from './app.config';
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
    document.documentElement.removeAttribute('theme-brand');
    document.documentElement.removeAttribute('theme-color');
    document.documentElement.removeAttribute('theme-style');

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
    document.documentElement.removeAttribute('theme-brand');
    document.documentElement.removeAttribute('theme-color');
    document.documentElement.removeAttribute('theme-style');
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

    expect(document.documentElement.dataset['mode']).toBe(etosBrandConfig.theme?.mode ?? 'light');
    expect(document.documentElement.getAttribute('theme-brand')).toBe('etos');
    expect(document.documentElement.hasAttribute('theme-color')).toBe(false);
    expect(document.documentElement.hasAttribute('theme-style')).toBe(false);
    expect(document.documentElement.dataset['color']).toBeUndefined();
    expect(document.documentElement.dataset['style']).toBeUndefined();
    expect(document.documentElement.dataset['theme']).toBe('etos');
    expect(localStorage.getItem('theme-mode')).toBe(etosBrandConfig.theme?.mode ?? 'light');
    expect(localStorage.getItem('theme-brand')).toBe('etos');
    expect(localStorage.getItem('theme-color')).toBeNull();
    expect(localStorage.getItem('theme-style')).toBeNull();
  });

  it('should apply configured layout defaults on bootstrap', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(localStorage.getItem('layout-mode')).toBe(etosBrandConfig.layout?.mode ?? 'vertical');
    expect(localStorage.getItem('layout-width')).toBe('fixed');
  });

  it('should resolve the dashboard route under the pages shell', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigated = await router.navigateByUrl('/dashboard');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigated).toBe(true);
    expect(router.url).toBe('/dashboard');
    expect(fixture.nativeElement.textContent).toContain('Operations overview');
    expect(fixture.nativeElement.textContent).toContain('Footer');
  });

  it('should resolve reused library showcase routes inside the Etos shell', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigated = await router.navigateByUrl('/ui/shadcn/button');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigated).toBe(true);
    expect(router.url).toBe('/ui/shadcn/button');
    expect(fixture.nativeElement.textContent).toContain('Button');
    expect(fixture.nativeElement.textContent).toContain('Variants');
  });
});
