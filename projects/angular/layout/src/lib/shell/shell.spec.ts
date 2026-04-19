import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { provideMaterialLayout } from '../core/layout.provider';
import { ShellLayoutComponent } from './shell';

@Component({
  imports: [ShellLayoutComponent],
  template: `
    <ui-shell>
      <div ui-shell-header class="contents">Header</div>
      <div ui-shell-main class="contents">Main</div>
      <div ui-shell-footer class="contents">Footer</div>
    </ui-shell>
  `,
})
class HostComponent {}

@Component({
  imports: [ShellLayoutComponent],
  template: `
    <ui-shell
      verticalHeaderClass="vertical-header"
      verticalContentClass="vertical-content"
      verticalFooterClass="vertical-footer"
      horizontalHeaderClass="horizontal-header"
      horizontalContentClass="horizontal-content"
      horizontalFooterClass="horizontal-footer">
      <div ui-shell-header>Header</div>
      <div ui-shell-main>Main</div>
      <div ui-shell-footer>Footer</div>
    </ui-shell>
  `,
})
class CustomClassHostComponent {}

@Component({
  imports: [ShellLayoutComponent],
  template: `
    <ui-shell
      title="Overview"
      description="Page summary"
      verticalContentClass="page-content"
      horizontalContentClass="page-content">
      <button ui-shell-actions type="button">Action</button>
      <section data-page-body>Main</section>
    </ui-shell>
  `,
})
class PageHeaderHostComponent {}

describe('ShellLayoutComponent', () => {
  beforeEach(() => {
    localStorage.removeItem('layout-mode');
    localStorage.removeItem('layout-width');
  });

  it('projects header, main, and footer content with the vertical shell classes by default', () => {
    TestBed.configureTestingModule({
      providers: [provideMaterialLayout({ mode: 'vertical' })],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('ui-shell') as HTMLElement | null;
    const header = root.querySelector('header') as HTMLElement | null;
    const main = root.querySelector('main') as HTMLElement | null;
    const section = root.querySelector('section') as HTMLElement | null;
    const footer = root.querySelector('footer') as HTMLElement | null;

    expect(host?.getAttribute('data-layout-mode')).toBe('vertical');
    expect(section?.getAttribute('data-shell-layout')).toBe('vertical');
    expect(header?.textContent).toContain('Header');
    expect(main?.textContent).toContain('Main');
    expect(footer?.textContent).toContain('Footer');
    expect(header?.className).toContain('bg-card');
    expect(header?.className).toContain('px-4');
    expect(main?.className).toContain('flex-1');
    expect(main?.className).toContain('overflow-auto');
    expect(section?.className).toContain('min-h-full');
    expect(section?.className).toContain('flex-col');
    expect(section?.className).not.toContain('p-6');
    expect(footer?.className).toContain('bg-card');
    expect(footer?.className).toContain('px-4');
  });

  it('switches to the horizontal shell classes when the layout mode is horizontal', () => {
    TestBed.configureTestingModule({
      providers: [provideMaterialLayout({ mode: 'horizontal' })],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('ui-shell') as HTMLElement | null;
    const header = root.querySelector('header') as HTMLElement | null;
    const section = root.querySelector('section') as HTMLElement | null;
    const footer = root.querySelector('footer') as HTMLElement | null;

    expect(host?.getAttribute('data-layout-mode')).toBe('horizontal');
    expect(section?.getAttribute('data-shell-layout')).toBe('horizontal');
    expect(header?.className).toContain('justify-between');
    expect(header?.className).toContain('p-6');
    expect(header?.className).not.toContain('bg-card');
    expect(section?.className).toContain('p-6');
    expect(footer?.className).toContain('px-6');
    expect(footer?.className).not.toContain('bg-card');
  });

  it('supports overriding shell classes through inputs', () => {
    TestBed.configureTestingModule({
      providers: [provideMaterialLayout({ mode: 'horizontal' })],
    });

    const fixture = TestBed.createComponent(CustomClassHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const header = root.querySelector('header') as HTMLElement | null;
    const section = root.querySelector('section') as HTMLElement | null;
    const footer = root.querySelector('footer') as HTMLElement | null;

    expect(header?.className).toBe('horizontal-header');
    expect(section?.className).toBe('horizontal-content');
    expect(footer?.className).toBe('horizontal-footer');
  });

  it('renders a page header inside the content area when title and description are provided', () => {
    TestBed.configureTestingModule({
      providers: [provideMaterialLayout({ mode: 'vertical' })],
    });

    const fixture = TestBed.createComponent(PageHeaderHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('ui-shell') as HTMLElement | null;
    const section = root.querySelector('section') as HTMLElement | null;
    const pageBody = root.querySelector('[data-page-body]') as HTMLElement | null;
    const action = root.querySelector('button') as HTMLButtonElement | null;

    expect(host?.getAttribute('title')).toBeNull();
    expect(host?.getAttribute('description')).toBeNull();
    expect(section?.className).toContain('max-w-7xl');
    expect(section?.className).toContain('px-6');
    expect(action?.textContent).toContain('Action');
    expect(pageBody?.textContent).toContain('Main');
    expect(section?.textContent).toContain('Overview');
    expect(section?.textContent).toContain('Page summary');
  });
});
