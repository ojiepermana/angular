import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { HorizontalLayoutComponent } from './horizontal.component';

@Component({
  imports: [HorizontalLayoutComponent],
  template: `
    <horizontal>
      <a ui-layout-brand href="/">Brand</a>
      <button ui-layout-profile type="button">Profile</button>
    </horizontal>
  `,
})
class HostComponent {}

describe('HorizontalLayoutComponent', () => {
  it('projects brand and profile content into the topbar', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-ui-topbar-slot="start"]')?.textContent).toContain('Brand');
    expect(root.querySelector('[data-ui-topbar-slot="nav"] [role="menubar"]')).toBeTruthy();
    expect(root.querySelector('[data-ui-topbar-slot="end"]')?.textContent).toContain('Profile');
  });
});
