import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-menu-item, button[ui-menu-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"menuitem"',
    '[attr.tabindex]': 'disabled() ? -1 : -1',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-inset]': 'inset() ? "true" : null',
    '(click)': 'handleClick($any($event))',
    '(keydown.enter)': 'handleClick($any($event))',
    '(keydown.space)': 'handleClick($any($event))',
  },
  template: `<ng-content />`,
})
export class MenuItemComponent {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly disabled = input<boolean>(false);
  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  readonly selected = output<MouseEvent | KeyboardEvent>();

  protected readonly classes = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'transition-colors focus:bg-accent focus:text-accent-foreground',
      'data-[inset=true]:pl-8',
      'aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.class(),
    ),
  );

  focus(): void {
    this.el.nativeElement.focus();
  }

  getLabel(): string {
    return this.el.nativeElement.textContent?.trim() ?? '';
  }

  protected handleClick(e: MouseEvent | KeyboardEvent): void {
    if (this.disabled()) return;
    this.selected.emit(e);
  }
}

@Component({
  selector: 'ui-menu-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': '"horizontal"',
  },
  template: '',
})
export class MenuSeparatorComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('-mx-1 my-1 h-px bg-muted block', this.class()));
}

@Component({
  selector: 'ui-menu-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class MenuLabelComponent {
  readonly inset = input<boolean>(false);
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('px-2 py-1.5 text-sm font-semibold text-foreground', this.inset() ? 'pl-8' : '', this.class()),
  );
}

@Component({
  selector: 'ui-menu-shortcut, span[ui-menu-shortcut]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class MenuShortcutComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}
