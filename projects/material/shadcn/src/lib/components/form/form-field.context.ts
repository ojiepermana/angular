import { Injectable, computed, effect, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

let nextId = 0;

/**
 * Backing store for a single `<ui-form-field>`. Provided on the component
 * so descendant parts (label, description, message, control) can inject it.
 */
@Injectable()
export class FormFieldContext {
  private readonly uid = ++nextId;
  readonly controlId = `ui-form-field-${this.uid}`;
  readonly descriptionId = `${this.controlId}-description`;
  readonly messageId = `${this.controlId}-message`;

  readonly control = signal<AbstractControl | null>(null);
  readonly hasDescription = signal(false);
  readonly hasMessage = signal(false);

  private readonly statusTick = signal(0);

  readonly invalid = computed(() => {
    this.statusTick();
    const c = this.control();
    return !!c && c.invalid && (c.touched || c.dirty);
  });

  readonly firstError = computed<string | null>(() => {
    this.statusTick();
    const c = this.control();
    if (!c?.errors) return null;
    const keys = Object.keys(c.errors);
    return keys.length > 0 ? keys[0]! : null;
  });

  readonly describedBy = computed(() => {
    const parts: string[] = [];
    if (this.hasDescription()) parts.push(this.descriptionId);
    if (this.hasMessage() && this.invalid()) parts.push(this.messageId);
    return parts.length > 0 ? parts.join(' ') : null;
  });

  constructor() {
    // Re-run computed() above whenever the control's status changes.
    effect((onCleanup) => {
      const c = this.control();
      if (!c) return;
      const sub = c.statusChanges.subscribe(() => this.statusTick.update((n) => n + 1));
      onCleanup(() => sub.unsubscribe());
    });
  }
}
