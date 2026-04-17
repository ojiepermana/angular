import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { TextareaComponent } from './textarea.component';

@Component({
  imports: [TextareaComponent, FormsModule],
  template: `<textarea ui-textarea [(ngModel)]="value" rows="3"></textarea>`,
})
class Host {
  value = '';
}

describe('TextareaComponent', () => {
  it('applies base styling', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const ta = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(ta.className).toContain('rounded-md');
    expect(ta.className).toContain('border-input');
    expect(ta.className).toContain('min-h-[60px]');
  });

  it('binds via ngModel', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const ta = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    ta.value = 'hello';
    ta.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value).toBe('hello');
  });
});
