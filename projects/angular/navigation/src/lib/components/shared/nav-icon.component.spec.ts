import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UiNavIconComponent } from './nav-icon.component';

const FONT_SELECTOR = 'link[data-ui-nav-icon-font="material-symbols-outlined"]';

@Component({
  imports: [UiNavIconComponent],
  template: `
    <ui-nav-icon name="menu" [size]="18" />
    <ui-nav-icon name="search" [size]="20" />
  `,
})
class HostComponent {}

describe('UiNavIconComponent', () => {
  beforeEach(() => {
    document.head.querySelectorAll(FONT_SELECTOR).forEach((element) => element.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll(FONT_SELECTOR).forEach((element) => element.remove());
  });

  it('injects the Material Symbols stylesheet once', () => {
    const firstFixture = TestBed.createComponent(HostComponent);
    firstFixture.detectChanges();

    const secondFixture = TestBed.createComponent(HostComponent);
    secondFixture.detectChanges();

    const links = Array.from(document.head.querySelectorAll<HTMLLinkElement>(FONT_SELECTOR));

    expect(links).toHaveLength(1);
    expect(links[0]?.rel).toBe('stylesheet');
    expect(links[0]?.href).toContain('Material+Symbols+Outlined');
  });

  it('applies the ligature class and inline variation settings', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('ui-nav-icon') as HTMLElement | null;

    expect(icon?.textContent?.trim()).toBe('menu');
    expect(icon?.className).toContain('material-symbols-outlined');
    expect(icon?.style.fontVariationSettings).toContain('FILL');
  });
});
