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
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { filter, map } from 'rxjs/operators';
import { UiNavIconComponent } from '../shared/nav-icon.component';
import { UiNavItemComponent } from '../shared/nav-item.component';
import { NavigationService, DEFAULT_NAVIGATION_ID } from '../../core/services/navigation.service';
import type { NavigationItem, SidebarAppearance, SidebarPosition } from '../../core/types/navigation.type';

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
  selector: 'sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, UiNavIconComponent, UiNavItemComponent],
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'hostClasses()',
    '[attr.data-appearance]': 'resolvedAppearance()',
    '[attr.data-position]': 'position()',
    '[attr.data-expanded]': 'isExpanded()',
    '[hidden]': 'isMobile()',
    '(mouseenter)': 'onHoverEnter()',
    '(mouseleave)': 'onHoverLeave()',
    '(focusin)': 'onHoverEnter()',
    '(click)': 'onHostClick($event)',
  },
  template: `
    <div [class]="innerClasses()">
      <ng-container [ngTemplateOutlet]="body" />
    </div>

    <ng-template #body>
      @if (header()) {
        <div [class]="headerClasses()">
          <div [class]="headerSlotClasses()">
            <ng-content select="[sidebar-header]" />
          </div>
          @if (!isMobile() && !isCompact()) {
            <button
              type="button"
              data-sidebar-toggle
              class="ml-auto mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              [attr.aria-label]="toggleButtonLabel()"
              [attr.title]="toggleButtonLabel()"
              [attr.aria-pressed]="resolvedAppearance() === 'thin'"
              (click)="toggleAppearance($event)">
              <ui-nav-icon name="view_sidebar" [size]="18" class="text-current" />
            </button>
          }
        </div>
      }
      <nav [class]="navClasses()">
        @for (item of resolvedItems(); track item.id) {
          <ui-nav-item [item]="item" [compact]="isCompact()" />
        }
      </nav>
      <div [class]="footerClasses()">
        <div [class]="footerSlotClasses()">
          <ng-content select="[sidebar-footer]" />
        </div>
      </div>
    </ng-template>

    <ng-template #drawerTpl>
      <div
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="ariaLabel()"
        class="flex h-full w-72 max-w-[85vw] flex-col text-foreground shadow-xl"
        [class.border-l]="position() === 'right'"
        [class.border-brand]="position() === 'right'">
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
  /** Registry key di `NavigationService`. Default `'main'`. */
  readonly navigationId = input<string>(DEFAULT_NAVIGATION_ID);
  readonly appearance = input<SidebarAppearance>('default');
  readonly position = input<SidebarPosition>('left');
  readonly ariaLabel = input<string>('Primary');
  readonly header = input<boolean>(true);
  readonly class = input<string>('');
  /** Auto switch ke CDK overlay drawer saat viewport `< md`. */
  readonly autoMobile = input<boolean>(true);
  /** Auto-register `items` ke `NavigationService` agar `activeTrail` bekerja. */
  readonly autoRegister = input<boolean>(true);

  /** Resolved items: input jika disediakan, fallback ke registry NavigationService. */
  protected readonly resolvedItems = computed(() => {
    const explicit = this.items();
    return explicit.length > 0 ? explicit : this.nav.getItems(this.navigationId())();
  });

  private readonly hovered = signal<boolean>(false);
  private readonly suppressHoverUntilLeave = signal<boolean>(false);

  private readonly drawerTpl = viewChild.required<TemplateRef<unknown>>('drawerTpl');
  private drawerRef: OverlayRef | null = null;
  private focusTrap: FocusTrap | null = null;
  private previouslyFocused: HTMLElement | null = null;

  /** True saat viewport `< md` (767.98px). */
  protected readonly isMobileMedia = toSignal(this.bp.observe('(max-width: 767.98px)').pipe(map((s) => s.matches)), {
    initialValue: false,
  });

  protected readonly isMobile = computed(() => this.autoMobile() && this.isMobileMedia());
  protected readonly resolvedCollapsed = computed(() => {
    if (this.nav.hasStoredSidebarCollapse()) {
      return this.nav.collapsed();
    }

    return this.appearance() === 'thin';
  });
  protected readonly resolvedAppearance = computed<SidebarAppearance>(() => {
    return this.resolvedCollapsed() ? 'thin' : 'default';
  });
  protected readonly hoverActive = computed(() => this.hovered() && !this.suppressHoverUntilLeave());
  protected readonly isExpanded = computed(() => !this.resolvedCollapsed() || this.hoverActive());
  protected readonly isCompact = computed(() => !this.isMobile() && this.resolvedCollapsed() && !this.hoverActive());
  protected readonly toggleButtonLabel = computed(() =>
    this.resolvedCollapsed() ? 'Expand sidebar' : 'Collapse sidebar',
  );

  constructor() {
    // Auto-register items ke service untuk active trail (hanya jika input non-kosong).
    effect(() => {
      const explicit = this.items();
      if (this.autoRegister() && explicit.length > 0) this.nav.registerItems(this.navigationId(), explicit);
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
    const base = ['relative flex shrink-0 text-foreground', 'transition-[width] duration-200 ease-out'];
    if (this.resolvedCollapsed()) base.push('w-16');
    else base.push('[width:17.5rem]');
    if (this.position() === 'right') base.push('border-l', 'border-brand');
    return [...base, this.class()].join(' ');
  });

  protected readonly headerClasses = computed(() => {
    const base = ['flex h-12 items-center gap-2 border-b border-brand'];
    if (this.isCompact()) {
      base.push('justify-center px-2');
    }
    return base.join(' ');
  });

  protected readonly headerSlotClasses = computed(() => {
    const base = ['min-w-0'];
    if (this.isCompact()) {
      base.push(
        'flex flex-1 items-center justify-center overflow-hidden',
        '[&>[sidebar-header]>*]:mx-auto',
        '[&>[sidebar-header]>*]:max-w-full',
        '[&>[sidebar-header]>*]:shrink-0',
      );
    } else {
      base.push('flex min-w-0 flex-1 items-center');
    }
    return base.join(' ');
  });

  protected readonly navClasses = computed(() => {
    const base = ['flex-1 overflow-y-auto overflow-x-hidden'];
    if (this.isCompact()) {
      base.push(
        'px-2',
        '[&_.ui-nav-text]:mx-auto',
        '[&_.ui-nav-text]:w-10',
        '[&_.ui-nav-text]:justify-center',
        '[&_.ui-nav-text]:px-0',
      );
    }
    return base.join(' ');
  });

  protected readonly footerClasses = computed(() => {
    const base = ['h-12 border-t border-brand'];
    if (this.isCompact()) {
      base.push('flex items-center justify-center px-2');
    }
    return base.join(' ');
  });

  protected readonly footerSlotClasses = computed(() => {
    const base = ['h-full'];
    if (this.isCompact()) {
      base.push(
        'flex h-full items-center justify-center overflow-hidden',
        '[&>[sidebar-footer]>*]:mx-auto',
        '[&>[sidebar-footer]>*]:w-auto',
        '[&>[sidebar-footer]>*]:max-w-full',
        '[&>[sidebar-footer]>*]:justify-center',
        '[&>[sidebar-footer]>*]:gap-0',
        '[&>[sidebar-footer]>*]:px-0',
        '[&>[sidebar-footer]>*>*:first-child]:mx-auto',
        '[&>[sidebar-footer]>*>*:nth-child(n+2)]:hidden',
      );
    } else {
      base.push('w-full');
    }
    return base.join(' ');
  });

  protected readonly innerClasses = computed(() => {
    const overlayActive = this.resolvedCollapsed() && this.hoverActive();
    const base = ['flex h-full flex-col transition-[width] duration-200 ease-out'];
    if (this.resolvedCollapsed()) {
      base.push('bg-background');
    }
    if (overlayActive) {
      base.push(
        'absolute inset-y-0 z-30 shadow-xl [width:17.5rem]',
        this.position() === 'right' ? 'right-0 border-l border-brand' : 'left-0 border-r border-brand',
      );
    } else {
      base.push('w-full');
    }
    return base.join(' ');
  });

  protected onHoverEnter(): void {
    if (!this.resolvedCollapsed() || this.isMobile() || this.suppressHoverUntilLeave()) return;
    this.hovered.set(true);
  }

  protected onHoverLeave(): void {
    this.suppressHoverUntilLeave.set(false);
    if (this.resolvedCollapsed()) this.hovered.set(false);
  }

  protected toggleAppearance(event: MouseEvent): void {
    event.stopPropagation();
    const nextCollapsed = !this.resolvedCollapsed();
    this.nav.setCollapsed(nextCollapsed);
    this.hovered.set(false);
    this.suppressHoverUntilLeave.set(nextCollapsed);
  }

  /** Touch fallback: tap pada strip thin (ketika belum expanded) untuk expand. */
  protected onHostClick(event: MouseEvent): void {
    if (!this.resolvedCollapsed() || this.isMobile()) return;
    if (this.hovered()) return;
    const target = event.target as HTMLElement | null;
    // Biarkan klik pada control interaktif terus propagate (tidak intercept).
    if (target && target.closest('a,button,[role="menuitem"]')) return;
    this.hovered.set(true);
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
      panelClass: ['sidebar-drawer'],
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
