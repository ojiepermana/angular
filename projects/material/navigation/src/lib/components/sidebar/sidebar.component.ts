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
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT, NgClass, NgTemplateOutlet } from '@angular/common';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { filter, map } from 'rxjs/operators';
import { UiNavItemComponent } from '../shared/nav-item.component';
import { NavigationService } from '../../core/services/navigation.service';
import type {
  NavigationItem,
  SidebarAppearance,
  SidebarMode,
  SidebarPosition,
} from '../../core/types/navigation.type';

/**
 * Vertical navigation (sidebar) — shadcn-styled.
 *
 * Variants:
 * - `default`: 17.5rem, label + icon
 * - `thin`: 4rem icon-only; hover memunculkan overlay expand (tidak push konten)
 *
 * Mobile (`< md`): saat `autoMobile=true` (default), host desktop disembunyikan
 * dan konten dirender lewat CDK Overlay drawer dengan focus trap. State buka
 * dikontrol lewat `NavigationService.mobileOpen`.
 */
@Component({
  selector: 'ui-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgTemplateOutlet, UiNavItemComponent],
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'hostClasses()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-position]': 'position()',
    '[attr.data-expanded]': 'isExpanded()',
    '[hidden]': 'isMobile()',
    '(mouseenter)': 'onHoverEnter()',
    '(mouseleave)': 'onHoverLeave()',
    '(focusin)': 'onHoverEnter()',
  },
  template: `
    <div [class]="innerClasses()">
      <ng-container [ngTemplateOutlet]="body" />
    </div>

    <ng-template #body>
      @if (header()) {
        <div class="flex h-14 items-center gap-2 border-b border-border px-3">
          <ng-content select="[ui-sidebar-header]" />
        </div>
      }
      <nav class="flex-1 overflow-y-auto overflow-x-hidden p-2">
        @for (item of items(); track item.id) {
          <ui-nav-item [item]="item" [compact]="isCompact()" />
        }
      </nav>
      <div class="border-t border-border">
        <ng-content select="[ui-sidebar-footer]" />
      </div>
    </ng-template>

    <ng-template #drawerTpl>
      <div
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="ariaLabel()"
        class="flex h-full w-72 max-w-[85vw] flex-col bg-background text-foreground shadow-xl"
        [ngClass]="position() === 'right' ? 'border-l border-border' : 'border-r border-border'"
      >
        <ng-container [ngTemplateOutlet]="body" />
      </div>
    </ng-template>
  `,
})
export class SidebarComponent {
  private readonly nav = inject(NavigationService);
  private readonly bp = inject(BreakpointObserver);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = input<NavigationItem[]>([]);
  readonly appearance = input<SidebarAppearance>('default');
  readonly position = input<SidebarPosition>('left');
  readonly mode = input<SidebarMode>('side');
  readonly ariaLabel = input<string>('Primary');
  readonly header = input<boolean>(true);
  readonly class = input<string>('');
  /** Auto switch ke CDK overlay drawer saat viewport `< md`. */
  readonly autoMobile = input<boolean>(true);

  private readonly hovered = signal<boolean>(false);

  private readonly drawerTpl = viewChild.required<TemplateRef<unknown>>('drawerTpl');
  private drawerRef: OverlayRef | null = null;
  private focusTrap: FocusTrap | null = null;
  private previouslyFocused: HTMLElement | null = null;

  /** True saat viewport `< md` (767.98px). */
  protected readonly isMobileMedia = toSignal(
    this.bp.observe('(max-width: 767.98px)').pipe(map((s) => s.matches)),
    { initialValue: false },
  );

  protected readonly isMobile = computed(() => this.autoMobile() && this.isMobileMedia());

  protected readonly isExpanded = computed(() => this.appearance() === 'default' || this.hovered());
  protected readonly isCompact = computed(
    () => !this.isMobile() && this.appearance() === 'thin' && !this.hovered(),
  );

  constructor() {
    effect(() => {
      this.nav.setCollapsed(this.appearance() === 'thin' && !this.isMobile());
    });

    // Kelola overlay drawer berdasarkan mobileOpen + isMobile.
    effect(() => {
      const open = this.nav.mobileOpen();
      const mobile = this.isMobile();
      if (mobile && open) this.openDrawer();
      else this.closeDrawer();
    });

    this.destroyRef.onDestroy(() => this.closeDrawer());
  }

  protected readonly hostClasses = computed(() => {
    const base = [
      'relative flex shrink-0 bg-background text-foreground',
      'transition-[width] duration-200 ease-out',
    ];
    const appearance = this.appearance();
    if (appearance === 'thin') base.push('w-16');
    else base.push('[width:17.5rem]');
    if (this.position() === 'right') base.push('border-l');
    else base.push('border-r');
    base.push('border-border');
    return [...base, this.class()].join(' ');
  });

  protected readonly innerClasses = computed(() => {
    const base = ['flex h-full w-full flex-col', 'transition-[width] duration-200 ease-out'];
    if (this.appearance() === 'thin' && this.hovered()) {
      base.push(
        'absolute inset-y-0 z-30 bg-background shadow-xl',
        '[width:17.5rem]',
        this.position() === 'right'
          ? 'right-0 border-l border-border'
          : 'left-0 border-r border-border',
      );
    }
    return base.join(' ');
  });

  protected onHoverEnter(): void {
    if (this.appearance() === 'thin' && !this.isMobile()) this.hovered.set(true);
  }

  protected onHoverLeave(): void {
    if (this.appearance() === 'thin') this.hovered.set(false);
  }

  private openDrawer(): void {
    if (this.drawerRef) return;
    const side = this.position();
    const pos = this.overlay.position().global().top('0');
    if (side === 'right') pos.right('0');
    else pos.left('0');

    this.drawerRef = this.overlay.create({
      positionStrategy: pos,
      height: '100vh',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      panelClass: ['ui-sidebar-drawer'],
    });

    const portal = new TemplatePortal(this.drawerTpl(), this.vcr);
    const viewRef = this.drawerRef.attach(portal);
    viewRef.detectChanges();

    const root = this.drawerRef.overlayElement;
    this.focusTrap = this.focusTrapFactory.create(root);
    this.previouslyFocused = this.doc.activeElement as HTMLElement | null;
    queueMicrotask(() => this.focusTrap?.focusInitialElementWhenReady());

    this.drawerRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.nav.closeMobile());

    this.drawerRef
      .keydownEvents()
      .pipe(
        filter((e) => e.key === 'Escape'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.nav.closeMobile());
  }

  private closeDrawer(): void {
    if (!this.drawerRef) return;
    this.focusTrap?.destroy();
    this.focusTrap = null;
    this.drawerRef.dispose();
    this.drawerRef = null;
    this.previouslyFocused?.focus?.();
    this.previouslyFocused = null;
  }
}
