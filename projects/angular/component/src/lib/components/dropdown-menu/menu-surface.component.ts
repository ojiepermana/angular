import { FocusKeyManager, FocusableOption } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  QueryList,
  TemplateRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../core/cn/cn.util';
import { MenuItemComponent } from './menu-item.component';

/**
 * Surface rendered inside the overlay. Hosts keyboard navigation for its items.
 */
@Component({
  selector: 'ui-menu-surface',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"menu"',
    tabindex: '-1',
    '(keydown.arrowDown)': 'onArrow($any($event), 1)',
    '(keydown.arrowUp)': 'onArrow($any($event), -1)',
    '(keydown.home)': 'onHome($any($event))',
    '(keydown.end)': 'onEnd($any($event))',
    '(keydown.tab)': 'onTab($any($event))',
  },
  template: `<ng-content />`,
})
export class MenuSurfaceComponent implements AfterContentInit {
  readonly class = input<string>('');

  @ContentChildren(MenuItemComponent, { descendants: true })
  private readonly items!: QueryList<MenuItemComponent>;

  readonly closeRequested = output<void>();

  private keyManager: FocusKeyManager<MenuItemComponent> | null = null;

  protected readonly classes = computed(() =>
    cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none',
      this.class(),
    ),
  );

  ngAfterContentInit(): void {
    this.keyManager = new FocusKeyManager<MenuItemComponent & FocusableOption>(
      this.items as unknown as QueryList<MenuItemComponent & FocusableOption>,
    )
      .withWrap()
      .withTypeAhead();
    // Focus the first enabled item when the menu opens.
    queueMicrotask(() => this.keyManager?.setFirstItemActive());
  }

  protected onArrow(e: KeyboardEvent, delta: number): void {
    e.preventDefault();
    if (!this.keyManager) return;
    delta > 0 ? this.keyManager.setNextItemActive() : this.keyManager.setPreviousItemActive();
  }

  protected onHome(e: KeyboardEvent): void {
    e.preventDefault();
    this.keyManager?.setFirstItemActive();
  }

  protected onEnd(e: KeyboardEvent): void {
    e.preventDefault();
    this.keyManager?.setLastItemActive();
  }

  protected onTab(e: KeyboardEvent): void {
    e.preventDefault();
    this.closeRequested.emit();
  }
}

/**
 * Wraps an `<ng-template>` that holds `<ui-menu-surface>` + items.
 */
@Directive({
  selector: 'ng-template[uiMenuContent]',
  exportAs: 'uiMenuContent',
})
export class MenuContentDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
