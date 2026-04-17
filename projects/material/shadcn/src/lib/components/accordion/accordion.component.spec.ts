import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  AccordionComponent,
  AccordionContentComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
} from './accordion.component';

@Component({
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
    AccordionContentComponent,
  ],
  template: `
    <ui-accordion [type]="type">
      <ui-accordion-item value="one">
        <button ui-accordion-trigger>One</button>
        <ui-accordion-content>Body 1</ui-accordion-content>
      </ui-accordion-item>
      <ui-accordion-item value="two">
        <button ui-accordion-trigger>Two</button>
        <ui-accordion-content>Body 2</ui-accordion-content>
      </ui-accordion-item>
    </ui-accordion>
  `,
})
class Host {
  type: 'single' | 'multiple' = 'single';
}

describe('Accordion primitives', () => {
  function triggersOf(fixture: ReturnType<typeof TestBed.createComponent<Host>>) {
    return fixture.nativeElement.querySelectorAll(
      'button[ui-accordion-trigger]',
    ) as NodeListOf<HTMLButtonElement>;
  }

  it('wires aria attributes between trigger and content', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = triggersOf(fixture)[0];
    const content = fixture.nativeElement.querySelectorAll(
      'ui-accordion-content',
    )[0] as HTMLElement;
    expect(trigger.getAttribute('aria-controls')).toBe(content.getAttribute('id'));
    expect(content.getAttribute('aria-labelledby')).toBe(trigger.getAttribute('id'));
    expect(content.getAttribute('role')).toBe('region');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('type=single: opening the second closes the first', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const [t1, t2] = Array.from(triggersOf(fixture));
    t1.click();
    fixture.detectChanges();
    expect(t1.getAttribute('aria-expanded')).toBe('true');
    t2.click();
    fixture.detectChanges();
    expect(t1.getAttribute('aria-expanded')).toBe('false');
    expect(t2.getAttribute('aria-expanded')).toBe('true');
  });

  it('type=multiple: both can be open at once', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.type = 'multiple';
    fixture.detectChanges();
    const [t1, t2] = Array.from(triggersOf(fixture));
    t1.click();
    t2.click();
    fixture.detectChanges();
    expect(t1.getAttribute('aria-expanded')).toBe('true');
    expect(t2.getAttribute('aria-expanded')).toBe('true');
  });
});
