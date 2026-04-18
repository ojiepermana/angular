import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { CheckboxComponent } from './checkbox.component';

@Component({
  imports: [CheckboxComponent, FormsModule],
  template: `<ui-checkbox [(ngModel)]="checked">Accept</ui-checkbox>`,
})
class Host {
  checked = false;
}

describe('CheckboxComponent', () => {
  it('renders a mat-checkbox host with the ui-checkbox class', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const mat = fixture.nativeElement.querySelector('mat-checkbox') as HTMLElement;
    expect(mat).toBeTruthy();
    expect(mat.className).toContain('ui-checkbox');
  });

  it('propagates user toggle back to ngModel', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.checked).toBe(true);
  });

  it('projects label content', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Accept');
  });
});
