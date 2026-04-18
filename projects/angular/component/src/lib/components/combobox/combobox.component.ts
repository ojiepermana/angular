import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { cn } from '../../core/cn/cn.util';
import { buttonVariants } from '../button/button.variants';
import {
  CommandComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandInputComponent,
  CommandItemComponent,
  CommandListComponent,
} from '../command/command.component';

export interface ComboboxOption<T = unknown> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * Combobox with searchable option list. Options passed via `[options]`.
 * Emits two-way `value` and supports forms via ControlValueAccessor.
 */
@Component({
  selector: 'ui-combobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandItemComponent,
  ],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ComboboxComponent), multi: true }],
  host: { '[class]': 'classes()' },
  template: `
    <button
      #trigger
      type="button"
      role="combobox"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-controls]="isOpen() ? 'ui-combobox-panel' : null"
      [class]="triggerClasses()"
      [disabled]="disabled() || null"
      (click)="toggle()">
      <span [class.text-muted-foreground]="!selectedLabel()">
        {{ selectedLabel() || placeholder() }}
      </span>
      <svg
        class="ml-2 h-4 w-4 shrink-0 opacity-50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <ng-template #panel>
      <div
        id="ui-combobox-panel"
        class="w-[var(--ui-combobox-trigger-width)] rounded-md border bg-popover text-popover-foreground shadow-md">
        <ui-command>
          <input ui-command-input [placeholder]="searchPlaceholder()" />
          <ui-command-list>
            <ui-command-empty>{{ emptyText() }}</ui-command-empty>
            <ui-command-group>
              @for (opt of options(); track opt.value) {
                <button
                  type="button"
                  ui-command-item
                  [value]="opt.label"
                  [disabled]="!!opt.disabled"
                  (selected)="pick(opt)">
                  {{ opt.label }}
                  @if (isSelected(opt)) {
                    <svg
                      class="ml-auto h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                </button>
              }
            </ui-command-group>
          </ui-command-list>
        </ui-command>
      </div>
    </ng-template>
  `,
})
export class ComboboxComponent<T = unknown> implements ControlValueAccessor {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly options = input<ReadonlyArray<ComboboxOption<T>>>([]);
  readonly value = model<T | null>(null);
  readonly placeholder = input<string>('Select…');
  readonly searchPlaceholder = input<string>('Search…');
  readonly emptyText = input<string>('No results found.');
  readonly disabled = model<boolean>(false);
  readonly class = input<string>('');

  readonly valueChange = output<T | null>();

  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild.required<TemplateRef<unknown>>('panel');
  private overlayRef: OverlayRef | null = null;
  readonly isOpen = signal(false);

  protected readonly classes = computed(() => cn('inline-block', this.class()));

  protected readonly triggerClasses = computed(() =>
    cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-[200px] justify-between'),
  );

  protected readonly selectedLabel = computed(() => {
    const v = this.value();
    return this.options().find((o) => o.value === v)?.label ?? '';
  });

  private onChangeFn: (v: T | null) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected isSelected(opt: ComboboxOption<T>): boolean {
    return opt.value === this.value();
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  protected open(): void {
    if (this.isOpen()) return;
    const triggerEl = this.trigger().nativeElement;
    triggerEl.style.setProperty('--ui-combobox-trigger-width', triggerEl.offsetWidth + 'px');

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(triggerEl)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'ui-combobox-panel',
      minWidth: triggerEl.offsetWidth,
    });

    const portal = new TemplatePortal(this.panel(), this.vcr);
    this.overlayRef.attach(portal);

    merge(
      this.overlayRef.outsidePointerEvents().pipe(filter((e) => !triggerEl.contains(e.target as Node))),
      this.overlayRef.keydownEvents().pipe(filter((e) => e.key === 'Escape')),
      this.overlayRef.detachments(),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.close());

    this.isOpen.set(true);
    // Focus search input after attach tick
    queueMicrotask(() => this.overlayRef?.overlayElement.querySelector<HTMLInputElement>('input')?.focus());
  }

  protected close(): void {
    if (!this.isOpen()) return;
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
    this.trigger().nativeElement.focus();
    this.onTouchedFn();
  }

  protected pick(opt: ComboboxOption<T>): void {
    if (opt.disabled) return;
    const next = opt.value === this.value() ? null : opt.value;
    this.value.set(next);
    this.onChangeFn(next);
    this.valueChange.emit(next);
    this.close();
  }

  writeValue(v: T | null): void {
    this.value.set(v);
  }

  registerOnChange(fn: (v: T | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(state: boolean): void {
    this.disabled.set(state);
  }
}
