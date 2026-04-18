import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { DialogComponent } from './dialog.component';

@Component({
  imports: [DialogComponent],
  template: `
    <ui-dialog [(open)]="open" aria-labelledby="title">
      <h2 id="title">Are you sure?</h2>
      <p>This cannot be undone.</p>
    </ui-dialog>
  `,
})
class Host {
  open = false;
}

describe('DialogComponent', () => {
  it('does not render a surface when closed', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(document.body.querySelector('.ui-dialog-surface')).toBeNull();
  });

  it('opens into the body and sets role/aria-modal when open=true', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const surface = document.body.querySelector('.ui-dialog-surface') as HTMLElement | null;
    expect(surface).toBeTruthy();
    expect(surface!.getAttribute('role')).toBe('dialog');
    expect(surface!.getAttribute('aria-modal')).toBe('true');
    expect(surface!.getAttribute('aria-labelledby')).toBe('title');
  });

  it('detaches when the host fixture is destroyed', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.body.querySelector('.ui-dialog-surface')).toBeTruthy();
    fixture.destroy();
  });
});
