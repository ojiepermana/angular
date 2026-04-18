import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AlertComponent, AlertDescriptionComponent, AlertTitleComponent } from './alert.component';

@Component({
  imports: [AlertComponent, AlertTitleComponent, AlertDescriptionComponent],
  template: `
    <ui-alert [variant]="v">
      <ui-alert-title>Heads up!</ui-alert-title>
      <ui-alert-description>Something happened.</ui-alert-description>
    </ui-alert>
  `,
})
class Host {
  v: 'default' | 'destructive' = 'default';
}

describe('AlertComponent', () => {
  it('has role="alert" and composes with title/description', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('ui-alert') as HTMLElement;
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.querySelector('ui-alert-title')?.textContent).toContain('Heads up!');
    expect(alert.querySelector('ui-alert-description')?.textContent).toContain('Something happened.');
  });

  it('applies destructive variant tokens', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.v = 'destructive';
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('ui-alert') as HTMLElement;
    expect(alert.className).toContain('border-destructive');
  });
});
