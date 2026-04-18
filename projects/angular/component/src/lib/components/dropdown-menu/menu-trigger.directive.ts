import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DestroyRef, Directive, ElementRef, ViewContainerRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { MenuContentDirective } from './menu-surface.component';

export type MenuSide = 'top' | 'right' | 'bottom' | 'left';
export type MenuAlign = 'start' | 'center' | 'end';

function position(side: MenuSide, align: MenuAlign): ConnectedPosition {
  const ax = align === 'start' ? 'start' : align === 'end' ? 'end' : 'center';
  const ay = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
  switch (side) {
    case 'bottom':
      return { originX: ax, originY: 'bottom', overlayX: ax, overlayY: 'top', offsetY: 4 };
    case 'top':
      return { originX: ax, originY: 'top', overlayX: ax, overlayY: 'bottom', offsetY: -4 };
    case 'right':
      return { originX: 'end', originY: ay, overlayX: 'start', overlayY: ay, offsetX: 4 };
    case 'left':
      return { originX: 'start', originY: ay, overlayX: 'end', overlayY: ay, offsetX: -4 };
  }
}

/**
 * Opens an `<ng-template uiMenuContent>` anchored to the trigger element.
 */
@Directive({
  selector: '[uiMenuTrigger]',
  exportAs: 'uiMenuTrigger',
  host: {
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'isOpen()',
    '(click)': 'toggle()',
    '(keydown.enter)': 'openAndFocus($any($event))',
    '(keydown.space)': 'openAndFocus($any($event))',
    '(keydown.arrowDown)': 'openAndFocus($any($event))',
  },
})
export class MenuTriggerDirective {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly uiMenuTrigger = input.required<MenuContentDirective>();
  readonly side = input<MenuSide>('bottom');
  readonly align = input<MenuAlign>('start');
  readonly disabled = input<boolean>(false);

  readonly openedChange = output<boolean>();

  private overlayRef: OverlayRef | null = null;
  readonly isOpen = signal(false);

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  protected openAndFocus(e: KeyboardEvent): void {
    if (this.disabled()) return;
    e.preventDefault();
    this.open();
  }

  open(): void {
    if (this.isOpen() || this.disabled()) return;
    const primary = position(this.side(), this.align());
    const fallback = position(
      this.side() === 'top' ? 'bottom' : this.side() === 'bottom' ? 'top' : this.side(),
      this.align(),
    );

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().flexibleConnectedTo(this.el).withPositions([primary, fallback]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'ui-menu-panel',
    });

    const portal = new TemplatePortal(this.uiMenuTrigger().template, this.vcr);
    this.overlayRef.attach(portal);

    merge(
      this.overlayRef.outsidePointerEvents().pipe(filter((e) => !this.el.nativeElement.contains(e.target as Node))),
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
    // Restore focus to trigger
    this.el.nativeElement.focus();
  }
}
