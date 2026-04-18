import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DestroyRef, Directive, ElementRef, ViewContainerRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { MenuContentDirective } from '../dropdown-menu/menu-surface.component';

/**
 * Opens a menu anchored to the cursor when the host fires `contextmenu`.
 * Reuses `<ng-template uiMenuContent>` from the dropdown-menu entry.
 *
 * @example
 * <div [uiContextMenuTrigger]="menu" class="p-12 border">Right-click me</div>
 * <ng-template uiMenuContent #menu>
 *   <ui-menu-surface>
 *     <button ui-menu-item>Copy</button>
 *     <button ui-menu-item>Paste</button>
 *   </ui-menu-surface>
 * </ng-template>
 */
@Directive({
  selector: '[uiContextMenuTrigger]',
  exportAs: 'uiContextMenuTrigger',
  host: {
    '(contextmenu)': 'onContextMenu($event)',
  },
})
export class ContextMenuTriggerDirective {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly uiContextMenuTrigger = input.required<MenuContentDirective>();
  readonly disabled = input<boolean>(false);

  readonly openedChange = output<boolean>();

  private overlayRef: OverlayRef | null = null;
  readonly isOpen = signal(false);

  protected onContextMenu(event: MouseEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.close();
    this.openAt(event.clientX, event.clientY);
  }

  openAt(x: number, y: number): void {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo({ x, y })
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
          { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
          { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: false,
      panelClass: 'ui-menu-panel',
    });

    const portal = new TemplatePortal(this.uiContextMenuTrigger().template, this.vcr);
    this.overlayRef.attach(portal);

    merge(
      this.overlayRef.outsidePointerEvents(),
      this.overlayRef.keydownEvents().pipe(filter((e) => e.key === 'Escape')),
      this.overlayRef.detachments(),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.close());

    this.isOpen.set(true);
    this.openedChange.emit(true);
  }

  close(): void {
    if (!this.overlayRef) return;
    this.overlayRef.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
    this.openedChange.emit(false);
  }
}
