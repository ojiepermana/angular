import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';
import { cn } from '../../core/cn/cn.util';

/**
 * Declarative modal dialog. Renders into the body via CDK overlay when
 * `open` becomes `true`. Focus is trapped inside; restored to trigger on close.
 *
 * @example
 * <button ui-button (click)="open.set(true)">Open</button>
 * <ui-dialog [(open)]="open">
 *   <ui-dialog-header>
 *     <ui-dialog-title>Are you sure?</ui-dialog-title>
 *     <ui-dialog-description>This action cannot be undone.</ui-dialog-description>
 *   </ui-dialog-header>
 *   <ui-dialog-footer>
 *     <button ui-button variant="outline" (click)="open.set(false)">Cancel</button>
 *     <button ui-button variant="destructive" (click)="confirm()">Delete</button>
 *   </ui-dialog-footer>
 * </ui-dialog>
 */
@Component({
  selector: 'ui-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #tpl>
      <div
        class="ui-dialog-surface"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="labelledBy()"
        [attr.aria-describedby]="describedBy()"
        [class]="surfaceClasses()"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class DialogComponent {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly trapFactory = inject(FocusTrapFactory);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly open = model<boolean>(false);
  readonly closeOnEscape = input<boolean>(true);
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly labelledBy = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly describedBy = input<string | null>(null, { alias: 'aria-describedby' });
  readonly class = input<string>('');

  readonly openedChange = output<boolean>();

  private readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');
  private overlayRef: OverlayRef | null = null;
  private focusTrap: FocusTrap | null = null;
  private previousFocus: HTMLElement | null = null;

  protected readonly surfaceClasses = computed(() =>
    cn(
      'relative grid w-full max-w-lg gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      this.open() ? this.attach() : this.detach();
    });
  }

  private attach(): void {
    if (this.overlayRef) return;
    this.previousFocus = this.doc.activeElement as HTMLElement | null;

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'ui-dialog-backdrop',
      panelClass: 'ui-dialog-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });

    const portal = new TemplatePortal(this.tpl(), this.vcr);
    this.overlayRef.attach(portal);

    this.focusTrap = this.trapFactory.create(this.overlayRef.hostElement);
    this.focusTrap.focusInitialElementWhenReady();

    if (this.closeOnBackdropClick()) {
      this.overlayRef
        .backdropClick()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.requestClose());
    }

    this.overlayRef
      .keydownEvents()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((e) => e.key === 'Escape' && this.closeOnEscape()),
      )
      .subscribe((e) => {
        e.preventDefault();
        this.requestClose();
      });

    this.openedChange.emit(true);
  }

  private detach(): void {
    if (!this.overlayRef) return;
    this.focusTrap?.destroy();
    this.focusTrap = null;
    this.overlayRef.dispose();
    this.overlayRef = null;
    this.previousFocus?.focus?.();
    this.openedChange.emit(false);
  }

  private requestClose(): void {
    this.open.set(false);
  }

  close(): void {
    this.requestClose();
  }
}
