import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  BreadcrumbComponent,
  BreadcrumbEllipsisComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbListComponent,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
} from './breadcrumb.component';

@Component({
  imports: [
    BreadcrumbComponent,
    BreadcrumbListComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbPageComponent,
    BreadcrumbSeparatorComponent,
    BreadcrumbEllipsisComponent,
  ],
  template: `
    <nav ui-breadcrumb>
      <ol ui-breadcrumb-list>
        <li ui-breadcrumb-item><a ui-breadcrumb-link href="/">Home</a></li>
        <li ui-breadcrumb-separator></li>
        <li ui-breadcrumb-item><span ui-breadcrumb-page>Current</span></li>
        <li ui-breadcrumb-item><span ui-breadcrumb-ellipsis></span></li>
      </ol>
    </nav>
  `,
})
class Host {}

describe('Breadcrumb primitives', () => {
  it('wires accessibility attributes on nav, page, and separator', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('nav[ui-breadcrumb]')!.getAttribute('aria-label')).toBe('breadcrumb');
    const page = root.querySelector('span[ui-breadcrumb-page]')!;
    expect(page.getAttribute('aria-current')).toBe('page');
    expect(page.getAttribute('aria-disabled')).toBe('true');
    expect(page.getAttribute('role')).toBe('link');
    const sep = root.querySelector('li[ui-breadcrumb-separator]')!;
    expect(sep.getAttribute('aria-hidden')).toBe('true');
    expect(sep.querySelector('svg')).toBeTruthy();
    const ellipsis = root.querySelector('span[ui-breadcrumb-ellipsis]')!;
    expect(ellipsis.textContent).toContain('More');
  });
});
