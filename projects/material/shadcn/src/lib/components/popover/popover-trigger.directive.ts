import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  DestroyRef,
  Directive,
  ElementRef,
  ViewContainerRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { PopoverContentDirective } from './popover-content.directive';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

const POSITIONS: Record<PopoverSide, (align: PopoverAlign) => ConnectedPosition> = {
  top: (a) => ({
    originX: a === 'start' ? 'start' : a === 'end' ? 'end' : 'center',
    originY: 'top',
    overlayX: a === 'start' ? 'start' : a === 'end' ? 'end' : 'center',
    overlayY: 'bottom',
    offsetY: -8,
  }),
  bottom: (a) => ({
    originX: a === 'start' ? 'start' : a === 'end' ? 'end' : 'center',
    originY: 'bottom',
    overlayX: a === 'start' ? 'start' : a === 'end' ? 'end' : 'center',
    overlayY: 'top',
    offsetY: 8,
  }),
  left: (a) => ({
    originX: 'start',
    originY: a === 'start' ? 'top' : a === 'end' ? 'bottom' : 'center',
    overlayX: 'end',
    overlayY: a === 'start' ? 'top' : a === 'end' ? 'bottom' : 'center',
    offsetX: -8,
  }),
  right: (a) => ({
    originX: 'end',
    originY: a === 'start' ? 'top' : a === 'end' ? 'bottom' : 'center',
    overlayX: 'start',
    overlayY: a === 'start' ? 'top' : a === 'end' ? 'bottom' : 'center',
    offsetX: 8,
  }),
};

/**
 * Toggle a `<ng-template uiPopoverContent>` anchored to the host element.
 *
 * @example
 * <button ui-button [uiPopoverTrigger]="pop">Open</button>
 * <ng-template uiPopoverContent #pop>
 *   <div class="w-64 p-4">…</div>
 * </ng-template>
 */
@Directive({
  selector: '[uiPopoverTrigger]',
  exportAs: 'uiPopoverTrigger',
  host: {
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-haspopup]': '"dialog"',
    '(click)': 'toggle()',
    '(keydown.escape)': 'close()',
  },
})
export class PopoverTriggerDirective {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly uiPopoverTrigger = input.required<PopoverContentDirective>();
  readonly side = input<PopoverSide>('bottom');
  readonly align = input<PopoverAlign>('center');
  readonly disabled = input<boolean>(false);

  readonly openedChange = output<boolean>();

  private overlayRef: OverlayRef | null = null;
  readonly isOpen = signal(false);

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen() || this.disabled()) return;

    const primary = POSITIONS[this.side()](this.align());
    const fallback = POSITIONS[this.oppositeSide(this.side())](this.align());

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.el)
      .withPositions([primary, fallback])
      .withPush(false)
      .withFlexibleDimensions(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'ui-popover-panel',
    });

    const portal = new TemplatePortal(this.uiPopoverTrigger().template, this.vcr);
    this.overlayRef.attach(portal);

    merge(
      this.overlayRef
        .outsidePointerEvents()
        .pipe(filter((e) => !this.el.nativeElement.contains(e.target as Node))),
      this.overlayRef.keydownEvents().pipe(filter((e) => e.key === 'Escape')),
      this.overlayRef.detachments(),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.close());

    this.isOpen.set(true);
    this.openedChange.emit(true);
  }

  close(): void {
    if (!this.isOpen()) return;
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
    this.openedChange.emit(false);
  }

  private oppositeSide(side: PopoverSide): PopoverSide {
    return side === 'top'
      ? 'bottom'
      : side === 'bottom'
        ? 'top'
        : side === 'left'
          ? 'right'
          : 'left';
  }
}
