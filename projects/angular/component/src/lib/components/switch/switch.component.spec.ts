import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { SwitchComponent } from './switch.component';

@Component({
  imports: [SwitchComponent, FormsModule],
  template: `<ui-switch [(ngModel)]="on">Airplane mode</ui-switch>`,
})
class Host {
  on = false;
}

describe('SwitchComponent', () => {
  it('renders a mat-slide-toggle host with the ui-switch class', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const mat = fixture.nativeElement.querySelector('mat-slide-toggle') as HTMLElement;
    expect(mat).toBeTruthy();
    expect(mat.className).toContain('ui-switch');
  });

  it('projects its label content', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Airplane mode');
  });
});
