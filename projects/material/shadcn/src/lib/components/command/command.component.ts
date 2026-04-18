import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  QueryList,
  ViewChild,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../core/cn/cn.util';

/** Base class exposed to children for context lookup. */
@Directive()
export abstract class CommandContextBase {
  abstract query: ReturnType<typeof model<string>>;
  abstract matches(text: string): boolean;
  abstract registerItem(item: CommandItemComponent): void;
  abstract unregisterItem(item: CommandItemComponent): void;
  abstract focusNext(delta: number): void;
  abstract focusFirst(): void;
}

@Component({
  selector: 'ui-command',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CommandContextBase, useExisting: forwardRef(() => CommandComponent) }],
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class CommandComponent extends CommandContextBase {
  readonly query = model<string>('');
  readonly class = input<string>('');

  private readonly items = signal<CommandItemComponent[]>([]);
  private readonly activeIndex = signal(0);

  protected readonly classes = computed(() =>
    cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', this.class()),
  );

  override matches(text: string): boolean {
    const q = this.query().trim().toLowerCase();
    if (!q) return true;
    return text.toLowerCase().includes(q);
  }

  override registerItem(item: CommandItemComponent): void {
    this.items.update((list) => [...list, item]);
  }

  override unregisterItem(item: CommandItemComponent): void {
    this.items.update((list) => list.filter((i) => i !== item));
  }

  /** Items currently visible (not filtered out). */
  private visibleItems(): CommandItemComponent[] {
    return this.items().filter((it) => it.visible());
  }

  override focusNext(delta: number): void {
    const vis = this.visibleItems();
    if (vis.length === 0) return;
    const active = vis.findIndex((i) => i.active());
    const idx = active < 0 ? 0 : (active + delta + vis.length) % vis.length;
    vis.forEach((i, k) => i._setActive(k === idx));
    vis[idx].focus();
  }

  override focusFirst(): void {
    const vis = this.visibleItems();
    vis.forEach((i, k) => i._setActive(k === 0));
    vis[0]?.focus();
  }

  /** Returns the first visible item's text if any. Used when user hits Enter with no active. */
  getActive(): CommandItemComponent | null {
    return this.visibleItems().find((i) => i.active()) ?? this.visibleItems()[0] ?? null;
  }
}

@Component({
  selector: 'input[ui-command-input]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    type: 'text',
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': 'true',
    autocomplete: 'off',
    '[value]': 'ctx.query()',
    '[placeholder]': 'placeholder()',
    '(input)': 'onInput($any($event))',
    '(keydown.arrowDown)': 'onArrow($any($event), 1)',
    '(keydown.arrowUp)': 'onArrow($any($event), -1)',
    '(keydown.enter)': 'onEnter($any($event))',
  },
  template: ``,
})
export class CommandInputComponent {
  protected readonly ctx = inject(CommandComponent);
  readonly placeholder = input<string>('Type a command or search…');
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      'flex h-11 w-full rounded-md bg-transparent px-3 py-3 text-sm outline-none',
      'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      'border-b border-border',
      this.class(),
    ),
  );

  protected onInput(e: Event): void {
    this.ctx.query.set((e.target as HTMLInputElement).value);
    queueMicrotask(() => this.ctx.focusFirst());
  }

  protected onArrow(e: KeyboardEvent, delta: number): void {
    e.preventDefault();
    this.ctx.focusNext(delta);
  }

  protected onEnter(e: KeyboardEvent): void {
    const active = this.ctx.getActive();
    if (active) {
      e.preventDefault();
      active._select(e);
    }
  }
}

@Component({
  selector: 'ui-command-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()', role: 'listbox' },
  template: `<ng-content />`,
})
export class CommandListComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('max-h-[300px] overflow-y-auto overflow-x-hidden p-1', this.class()));
}

@Component({
  selector: 'ui-command-empty',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content>No results found.</ng-content>`,
})
export class CommandEmptyComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('py-6 text-center text-sm text-muted-foreground', this.class()));
}

@Component({
  selector: 'ui-command-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()', role: 'group' },
  template: `
    @if (heading()) {
      <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{{ heading() }}</div>
    }
    <ng-content />
  `,
})
export class CommandGroupComponent {
  readonly heading = input<string | null>(null);
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('overflow-hidden p-1 text-foreground', this.class()));
}

@Component({
  selector: 'ui-command-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()', role: 'separator' },
  template: '',
})
export class CommandSeparatorComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('-mx-1 h-px bg-border block', this.class()));
}

@Component({
  selector: 'ui-command-item, button[ui-command-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"option"',
    '[attr.tabindex]': '-1',
    '[attr.aria-selected]': 'active()',
    '[attr.data-active]': 'active() ? "true" : null',
    '[attr.data-disabled]': 'disabled() ? "true" : null',
    '[hidden]': '!visible()',
    '(click)': '_select($any($event))',
    '(mousemove)': 'onHover()',
  },
  template: `<ng-content />`,
})
export class CommandItemComponent {
  protected readonly ctx = inject(CommandComponent);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly selected = output<MouseEvent | KeyboardEvent>();

  readonly active = signal(false);

  readonly visible = computed(() => {
    const text = this.value() || this.el.nativeElement.textContent || '';
    return this.ctx.matches(text);
  });

  protected readonly classes = computed(() =>
    cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      this.class(),
    ),
  );

  constructor() {
    this.ctx.registerItem(this);
    inject(DestroyRef).onDestroy(() => this.ctx.unregisterItem(this));
  }

  focus(): void {
    this.el.nativeElement.focus();
  }

  _setActive(active: boolean): void {
    this.active.set(active);
  }

  _select(e: MouseEvent | KeyboardEvent): void {
    if (this.disabled()) return;
    this.selected.emit(e);
  }

  protected onHover(): void {
    if (this.disabled()) return;
    // Mark this item active; deactivate siblings.
    (this.ctx as unknown as { _activateOnly?: (i: CommandItemComponent) => void })._activateOnly?.(this);
    this._setActive(true);
  }
}

@Component({
  selector: 'span[ui-command-shortcut]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class CommandShortcutComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}
