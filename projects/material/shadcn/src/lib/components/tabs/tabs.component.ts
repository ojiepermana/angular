import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { cn } from '../../core/cn/cn.util';

/**
 * Shared state for a tabs group. Children read the active value and register
 * themselves so the group can drive roving-tabindex keyboard navigation.
 */
@Directive()
export abstract class TabsContextBase {
  abstract value: ReturnType<typeof model<string | null>>;
  abstract register(el: HTMLElement, value: string): void;
  abstract unregister(el: HTMLElement): void;
  abstract activate(value: string, focus?: boolean): void;
  abstract focusNext(from: HTMLElement, delta: number): void;
  abstract focusFirst(): void;
  abstract focusLast(): void;
}

@Component({
  selector: 'ui-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TabsContextBase, useExisting: forwardRef(() => TabsComponent) }],
  host: {
    '[class]': 'classes()',
    '[attr.data-orientation]': 'orientation()',
  },
  template: `<ng-content />`,
})
export class TabsComponent extends TabsContextBase {
  readonly value = model<string | null>(null);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<string>('');

  private readonly triggers = new Map<HTMLElement, string>();

  protected readonly classes = computed(() =>
    cn(this.orientation() === 'vertical' ? 'flex gap-4' : 'block', this.class()),
  );

  override register(el: HTMLElement, value: string): void {
    this.triggers.set(el, value);
    if (this.value() == null) this.value.set(value);
  }

  override unregister(el: HTMLElement): void {
    this.triggers.delete(el);
  }

  override activate(value: string, focus = false): void {
    this.value.set(value);
    if (focus) {
      for (const [el, v] of this.triggers) if (v === value) el.focus();
    }
  }

  override focusNext(from: HTMLElement, delta: number): void {
    const list = [...this.triggers.keys()];
    const idx = list.indexOf(from);
    if (idx < 0 || list.length === 0) return;
    const next = list[(idx + delta + list.length) % list.length];
    const val = this.triggers.get(next);
    if (val) this.activate(val, true);
  }

  override focusFirst(): void {
    const first = this.triggers.keys().next().value;
    const val = first ? this.triggers.get(first) : null;
    if (val) this.activate(val, true);
  }

  override focusLast(): void {
    const list = [...this.triggers.keys()];
    const last = list[list.length - 1];
    const val = last ? this.triggers.get(last) : null;
    if (val) this.activate(val, true);
  }
}

@Component({
  selector: 'ui-tabs-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"tablist"',
    '[attr.aria-orientation]': 'ctx.orientation()',
  },
  template: `<ng-content />`,
})
export class TabsListComponent {
  protected readonly ctx = inject(TabsComponent);
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      this.class(),
    ),
  );
}

@Component({
  selector: 'button[ui-tabs-trigger]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    type: 'button',
    '[attr.role]': '"tab"',
    '[attr.aria-selected]': 'selected()',
    '[attr.tabindex]': 'selected() ? 0 : -1',
    '[attr.data-state]': 'selected() ? "active" : "inactive"',
    '[disabled]': 'disabled() || null',
    '(click)': 'onClick()',
    '(keydown.arrowRight)': 'onArrow($any($event), 1, "horizontal")',
    '(keydown.arrowLeft)': 'onArrow($any($event), -1, "horizontal")',
    '(keydown.arrowDown)': 'onArrow($any($event), 1, "vertical")',
    '(keydown.arrowUp)': 'onArrow($any($event), -1, "vertical")',
    '(keydown.home)': 'onHome($any($event))',
    '(keydown.end)': 'onEnd($any($event))',
  },
  template: `<ng-content />`,
})
export class TabsTriggerComponent {
  protected readonly ctx = inject(TabsComponent);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly selected = computed(() => this.ctx.value() === this.value());

  protected readonly classes = computed(() =>
    cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium',
      'ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      this.class(),
    ),
  );

  ngOnInit(): void {
    this.ctx.register(this.el.nativeElement, this.value());
  }

  ngOnDestroy(): void {
    this.ctx.unregister(this.el.nativeElement);
  }

  protected onClick(): void {
    if (this.disabled()) return;
    this.ctx.activate(this.value());
  }

  protected onArrow(e: KeyboardEvent, delta: number, axis: 'horizontal' | 'vertical'): void {
    if (this.ctx.orientation() !== axis) return;
    e.preventDefault();
    this.ctx.focusNext(this.el.nativeElement, delta);
  }

  protected onHome(e: KeyboardEvent): void {
    e.preventDefault();
    this.ctx.focusFirst();
  }

  protected onEnd(e: KeyboardEvent): void {
    e.preventDefault();
    this.ctx.focusLast();
  }
}

@Component({
  selector: 'ui-tabs-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"tabpanel"',
    '[attr.data-state]': 'active() ? "active" : "inactive"',
    '[hidden]': '!active()',
    tabindex: '0',
  },
  template: `@if (active()) {
    <ng-content />
  }`,
})
export class TabsContentComponent {
  private readonly ctx = inject(TabsComponent);
  readonly value = input.required<string>();
  readonly class = input<string>('');
  protected readonly active = computed(() => this.ctx.value() === this.value());
  protected readonly classes = computed(() =>
    cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      this.class(),
    ),
  );
}
