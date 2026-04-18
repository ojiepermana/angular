import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  CommandComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandInputComponent,
  CommandItemComponent,
  CommandListComponent,
} from './command.component';

@Component({
  imports: [
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandItemComponent,
  ],
  template: `
    <ui-command>
      <input ui-command-input />
      <ui-command-list>
        <ui-command-empty>No results</ui-command-empty>
        <ui-command-group heading="Actions">
          <button ui-command-item value="New file">New file</button>
          <button ui-command-item value="Open">Open</button>
          <button ui-command-item value="Save">Save</button>
        </ui-command-group>
      </ui-command-list>
    </ui-command>
  `,
})
class Host {}

describe('Command', () => {
  it('renders input with role=combobox and list with role=listbox', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(fixture.nativeElement.querySelector('ui-command-list')!.getAttribute('role')).toBe('listbox');
    expect(fixture.nativeElement.querySelectorAll('[ui-command-item],[role=option]').length).toBeGreaterThanOrEqual(3);
  });

  it('filters items by the input query via hidden attribute', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'save';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('button[ui-command-item]') as NodeListOf<HTMLElement>;
    const visible = Array.from(items).filter((i) => !i.hasAttribute('hidden'));
    expect(visible.length).toBe(1);
    expect(visible[0].textContent).toContain('Save');
  });
});
