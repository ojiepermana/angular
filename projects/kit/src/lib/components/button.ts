import { Component, input, output, computed } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'op-button',
  imports: [],
  host: {
    '[class]': 'buttonClasses()',
    '[attr.type]': 'type()',
    '[attr.disabled]': 'disabled() || null',
    '(click)': 'handleClick($event)',
    'role': 'button',
    '[attr.aria-disabled]': 'disabled()'
  },
  template: `
    <ng-content />
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
      border: 1px solid transparent;
      border-radius: calc(var(--radius) - 2px);
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease-in-out;
      font-size: 0.875rem;
      text-decoration: none;
      outline: none;
    }

    :host:hover {
      opacity: 0.9;
    }

    :host:focus-visible {
      outline: 2px solid;
      outline-color: rgb(var(--ring));
      outline-offset: 2px;
    }

    :host:disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    /* Primary variant */
    :host(.btn-primary) {
      background-color: rgb(var(--primary));
      color: rgb(var(--primary-foreground));
    }

    :host(.btn-primary:hover) {
      background-color: rgb(var(--primary) / 0.9);
    }

    /* Secondary variant */
    :host(.btn-secondary) {
      background-color: rgb(var(--secondary));
      color: rgb(var(--secondary-foreground));
    }

    :host(.btn-secondary:hover) {
      background-color: rgb(var(--secondary) / 0.8);
    }

    /* Destructive variant */
    :host(.btn-destructive) {
      background-color: rgb(var(--destructive));
      color: rgb(var(--primary-foreground));
    }

    :host(.btn-destructive:hover) {
      background-color: rgb(var(--destructive) / 0.9);
    }

    /* Outline variant */
    :host(.btn-outline) {
      border: 1px solid rgb(var(--border));
      background-color: rgb(var(--background));
      color: rgb(var(--foreground));
    }

    :host(.btn-outline:hover) {
      background-color: rgb(var(--accent));
      color: rgb(var(--accent-foreground));
    }

    /* Ghost variant */
    :host(.btn-ghost) {
      background-color: transparent;
      color: rgb(var(--foreground));
    }

    :host(.btn-ghost:hover) {
      background-color: rgb(var(--accent));
      color: rgb(var(--accent-foreground));
    }

    /* Size variants */
    :host(.btn-sm) {
      height: 2rem;
      padding: 0 0.75rem;
      font-size: 0.875rem;
      gap: 0.375rem;
    }

    :host(.btn-md) {
      height: 2.5rem;
      padding: 0 1rem;
      font-size: 0.875rem;
      gap: 0.5rem;
    }

    :host(.btn-lg) {
      height: 3rem;
      padding: 0 1.5rem;
      font-size: 1rem;
      gap: 0.5rem;
    }
  `
})
export class Button {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);

  click = output<Event>();

  buttonClasses = computed(() => {
    const baseClass = 'btn-base';
    const variantClass = `btn-${this.variant()}`;
    const sizeClass = `btn-${this.size()}`;

    return [baseClass, variantClass, sizeClass].join(' ');
  });

  handleClick(event: Event) {
    if (!this.disabled()) {
      this.click.emit(event);
    }
  }
}
