import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { filter } from 'rxjs/operators';
import { cn } from '../../core/cn/cn.util';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

const SIDE_BASE: Record<SheetSide, string> = {
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
};

const SIDE_ENTER_FROM: Record<SheetSide, string> = {
  top: 'translateY(-100%)',
  bottom: 'translateY(100%)',
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
};

@Component({
  selector: 'ui-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #tpl>
      <div
        class="ui-sheet-surface fixed z-50 bg-background shadow-lg transition ease-in-out"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="labelledBy()"
        [attr.aria-describedby]="describedBy()"
        [class]="surfaceClasses()"
        [style.--ui-sheet-from]="enterFrom()">
        <ng-content />
      </div>
    </ng-template>
  `,
  styles: [
    `
      .ui-sheet-surface {
        animation: ui-sheet-in 300ms cubic-bezier(0.2, 0, 0, 1);
      }
      @keyframes ui-sheet-in {
        from {
          transform: var(--ui-sheet-from);
        }
        to {
          transform: translate(0, 0);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .ui-sheet-surface {
          animation-duration: 0ms;
        }
      }
    `,
  ],
})
export class SheetComponent {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly trapFactory = inject(FocusTrapFactory);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly open = model<boolean>(false);
  readonly side = input<SheetSide>('right');
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
    cn('gap-4 p-6 flex flex-col', SIDE_BASE[this.side()], this.class()),
  );

  protected readonly enterFrom = computed(() => SIDE_ENTER_FROM[this.side()]);

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
      panelClass: 'ui-sheet-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global(),
    });

    const portal = new TemplatePortal(this.tpl(), this.vcr);
    this.overlayRef.attach(portal);

    this.focusTrap = this.trapFactory.create(this.overlayRef.hostElement);
    this.focusTrap.focusInitialElementWhenReady();

    if (this.closeOnBackdropClick()) {
      this.overlayRef
        .backdropClick()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.open.set(false));
    }

    this.overlayRef
      .keydownEvents()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((e) => e.key === 'Escape' && this.closeOnEscape()),
      )
      .subscribe((e) => {
        e.preventDefault();
        this.open.set(false);
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

  close(): void {
    this.open.set(false);
  }
}
