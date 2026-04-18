import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { cn } from '../../core/cn/cn.util';

export type AccordionType = 'single' | 'multiple';

@Directive()
export abstract class AccordionContextBase {
  abstract isOpen(value: string): boolean;
  abstract toggle(value: string): void;
}

@Component({
  selector: 'ui-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: AccordionContextBase, useExisting: forwardRef(() => AccordionComponent) }],
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class AccordionComponent extends AccordionContextBase {
  readonly type = input<AccordionType>('single');
  readonly collapsible = input<boolean>(true);
  readonly value = model<string | string[] | null>(null);
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn('block', this.class()));

  private readonly openSet = computed<Set<string>>(() => {
    const v = this.value();
    if (v == null) return new Set();
    return new Set(Array.isArray(v) ? v : [v]);
  });

  override isOpen(value: string): boolean {
    return this.openSet().has(value);
  }

  override toggle(value: string): void {
    const isMulti = this.type() === 'multiple';
    const current = this.openSet();
    const open = current.has(value);
    if (isMulti) {
      const next = new Set(current);
      open ? next.delete(value) : next.add(value);
      this.value.set([...next]);
    } else {
      if (open) {
        if (this.collapsible()) this.value.set(null);
      } else {
        this.value.set(value);
      }
    }
  }
}

@Component({
  selector: 'ui-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  template: `<ng-content />`,
})
export class AccordionItemComponent {
  protected readonly ctx = inject(AccordionContextBase);
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly triggerId = `ui-accordion-trigger-${nextId()}`;
  readonly contentId = `ui-accordion-content-${nextId()}`;

  protected readonly classes = computed(() => cn('border-b', this.class()));

  readonly open = computed(() => this.ctx.isOpen(this.value()));

  toggle(): void {
    if (!this.disabled()) this.ctx.toggle(this.value());
  }
}

@Component({
  selector: 'button[ui-accordion-trigger]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    type: 'button',
    '[attr.id]': 'item.triggerId',
    '[attr.aria-controls]': 'item.contentId',
    '[attr.aria-expanded]': 'item.open()',
    '[attr.data-state]': 'item.open() ? "open" : "closed"',
    '[disabled]': 'item.disabled() || null',
    '(click)': 'item.toggle()',
  },
  template: `
    <ng-content />
    <svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0 transition-transform duration-200"
      [class.rotate-180]="item.open()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  `,
})
export class AccordionTriggerComponent {
  protected readonly item = inject(AccordionItemComponent);
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'flex flex-1 w-full items-center justify-between py-4 text-sm font-medium',
      'transition-all hover:underline',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      this.class(),
    ),
  );
}

@Component({
  selector: 'ui-accordion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.id]': 'item.contentId',
    '[attr.role]': '"region"',
    '[attr.aria-labelledby]': 'item.triggerId',
    '[attr.data-state]': 'item.open() ? "open" : "closed"',
    '[hidden]': '!item.open()',
  },
  template: `<div class="pb-4 pt-0 text-sm"><ng-content /></div>`,
})
export class AccordionContentComponent {
  protected readonly item = inject(AccordionItemComponent);
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('overflow-hidden text-sm', this.class()));
}

let _id = 0;
function nextId(): number {
  return ++_id;
}
