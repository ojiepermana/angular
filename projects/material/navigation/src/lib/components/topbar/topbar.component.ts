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
  signal,
  viewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UiNavIconComponent } from '../shared/nav-icon.component';
import { UiNavItemComponent } from '../shared/nav-item.component';
import { NavigationService } from '../../core/services/navigation.service';
import type {
  NavigationBasicItem,
  NavigationCollapsableItem,
  NavigationItem,
  NavigationMegaItem,
  TopbarAppearance,
} from '../../core/types/navigation.type';

interface ActiveOverlay {
  ref: OverlayRef;
  id: string;
}

/**
 * Horizontal navigation (topbar) — shadcn-styled.
 *
 * Variants:
 * - `default`: horizontal list; item `collapsable` buka dropdown
 * - `megamenu`: item `mega` buka panel full-width multi-kolom
 */
@Component({
  selector: 'ui-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterLink, RouterLinkActive, UiNavIconComponent, UiNavItemComponent],
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'hostClasses()',
    '[attr.data-appearance]': 'appearance()',
  },
  template: `
    <div class="flex h-14 w-full items-center gap-1 px-3">
      @if (showHamburger()) {
        <button
          type="button"
          class="mr-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          [attr.aria-label]="hamburgerLabel()"
          [attr.aria-expanded]="nav.mobileOpen()"
          (click)="nav.toggleMobile()"
        >
          <ui-nav-icon name="menu" class="text-xl" />
        </button>
      }
      <ng-content select="[ui-topbar-start]" />
      <ul
        class="flex flex-1 items-center gap-1"
        role="menubar"
        (keydown)="onMenubarKeydown($event)"
      >
        @for (item of items(); track item.id) {
          <li role="none" class="relative">
            @switch (item.type) {
              @case ('basic') {
                @let basic = asBasic(item);
                <a
                  role="menuitem"
                  class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
                  [routerLink]="basic.link"
                  routerLinkActive
                  #rla="routerLinkActive"
                  [attr.aria-current]="rla.isActive ? 'page' : null"
                  [target]="basic.target ?? undefined"
                >
                  @if (basic.icon) {
                    <ui-nav-icon [name]="basic.icon" class="text-lg" />
                  }
                  <span>{{ basic.title }}</span>
                </a>
              }
              @case ('collapsable') {
                @let col = asCollapsable(item);
                <button
                  #trigger
                  type="button"
                  role="menuitem"
                  class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  [attr.aria-expanded]="openId() === col.id"
                  [attr.aria-haspopup]="'menu'"
                  (click)="toggleDropdown(trigger, item)"
                  (mouseenter)="openDropdown(trigger, item)"
                >
                  @if (col.icon) {
                    <ui-nav-icon [name]="col.icon" class="text-lg" />
                  }
                  <span>{{ col.title }}</span>
                  <ui-nav-icon name="expand_more" class="text-base" />
                </button>
              }
              @case ('mega') {
                @let mega = asMega(item);
                <button
                  #trigger
                  type="button"
                  role="menuitem"
                  class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  [attr.aria-expanded]="openId() === mega.id"
                  [attr.aria-haspopup]="'menu'"
                  (click)="toggleMega(trigger, item)"
                  (mouseenter)="openMega(trigger, item)"
                >
                  @if (mega.icon) {
                    <ui-nav-icon [name]="mega.icon" class="text-lg" />
                  }
                  <span>{{ mega.title }}</span>
                  <ui-nav-icon name="expand_more" class="text-base" />
                </button>
              }
              @default {
                <span
                  class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {{ item.title }}
                </span>
              }
            }
          </li>
        }
      </ul>
      <ng-content select="[ui-topbar-end]" />
    </div>

    <!-- Dropdown template -->
    <ng-template #dropdownTpl let-item>
      <div
        role="menu"
        class="min-w-56 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        (keydown)="onPanelKeydown($event)"
      >
        @for (child of item.children; track child.id) {
          <ui-nav-item [item]="child" />
        }
      </div>
    </ng-template>

    <!-- Mega panel template -->
    <ng-template #megaTpl let-item>
      <div
        role="menu"
        class="w-screen max-w-[min(90vw,72rem)] rounded-md border border-border bg-popover p-6 text-popover-foreground shadow-lg"
        (keydown)="onPanelKeydown($event)"
      >
        <div class="grid gap-6" [ngClass]="megaColsClass(item.columns)">
          @for (col of item.children; track col.id) {
            <div>
              <div
                class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {{ col.title }}
              </div>
              <div class="flex flex-col gap-0.5">
                @for (leaf of col.children ?? []; track leaf.id) {
                  <ui-nav-item [item]="leaf" />
                }
              </div>
            </div>
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class TopbarComponent {
  protected readonly nav = inject(NavigationService);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = input<NavigationItem[]>([]);
  readonly appearance = input<TopbarAppearance>('default');
  readonly ariaLabel = input<string>('Primary');
  readonly class = input<string>('');
  /** Auto-register `items` ke `NavigationService` agar `activeTrail` bekerja. */
  readonly autoRegister = input<boolean>(true);
  /** Tampilkan hamburger di `< md` yang men-toggle mobile drawer sidebar. */
  readonly showHamburger = input<boolean>(true);
  readonly hamburgerLabel = input<string>('Open navigation');

  protected readonly openId = signal<string | null>(null);
  private active: ActiveOverlay | null = null;

  private readonly dropdownTpl = viewChild.required<TemplateRef<unknown>>('dropdownTpl');
  private readonly megaTpl = viewChild.required<TemplateRef<unknown>>('megaTpl');

  constructor() {
    effect(() => {
      if (this.autoRegister()) this.nav.registerItems(this.items());
    });
    this.destroyRef.onDestroy(() => this.closeAll());
  }

  protected readonly hostClasses = computed(() => {
    return [
      'sticky top-0 z-20 flex w-full items-center border-b border-border bg-background text-foreground',
      this.class(),
    ].join(' ');
  });

  protected asBasic(i: NavigationItem): NavigationBasicItem {
    return i as NavigationBasicItem;
  }
  protected asCollapsable(i: NavigationItem): NavigationCollapsableItem {
    return i as NavigationCollapsableItem;
  }
  protected asMega(i: NavigationItem): NavigationMegaItem {
    return i as NavigationMegaItem;
  }

  protected megaColsClass(columns?: number): string {
    const c = Math.min(Math.max(columns ?? 4, 1), 6);
    switch (c) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'md:grid-cols-2';
      case 3:
        return 'md:grid-cols-3';
      case 5:
        return 'md:grid-cols-5';
      case 6:
        return 'md:grid-cols-6';
      default:
        return 'md:grid-cols-4';
    }
  }

  protected toggleDropdown(trigger: HTMLElement, item: NavigationItem): void {
    if (this.openId() === item.id) this.closeAll();
    else this.openDropdown(trigger, item);
  }

  protected openDropdown(trigger: HTMLElement, item: NavigationItem): void {
    if (this.openId() === item.id) return;
    this.closeAll();
    this.attach(trigger, item, this.dropdownTpl(), /*fullWidth*/ false);
  }

  protected toggleMega(trigger: HTMLElement, item: NavigationItem): void {
    if (this.openId() === item.id) this.closeAll();
    else this.openMega(trigger, item);
  }

  protected openMega(trigger: HTMLElement, item: NavigationItem): void {
    if (this.openId() === item.id) return;
    this.closeAll();
    this.attach(trigger, item, this.megaTpl(), /*fullWidth*/ true);
  }

  private attach(
    trigger: HTMLElement,
    item: NavigationItem,
    tpl: TemplateRef<unknown>,
    fullWidth: boolean,
  ): void {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions(
        fullWidth
          ? [
              {
                originX: 'center',
                originY: 'bottom',
                overlayX: 'center',
                overlayY: 'top',
                offsetY: 4,
              },
              {
                originX: 'center',
                originY: 'top',
                overlayX: 'center',
                overlayY: 'bottom',
                offsetY: -4,
              },
            ]
          : [
              {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
                offsetY: 4,
              },
              {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
                offsetY: -4,
              },
            ],
      );

    const ref = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: fullWidth ? ['ui-mega-panel'] : ['ui-dropdown-panel'],
      width: fullWidth ? '100vw' : undefined,
      maxWidth: fullWidth ? '100vw' : undefined,
    });

    const portal = new TemplatePortal(tpl, this.vcr, { $implicit: item });
    ref.attach(portal);
    this.active = { ref, id: item.id ?? '' };
    this.openId.set(item.id ?? null);

    merge(ref.backdropClick(), ref.keydownEvents().pipe(filter((e) => e.key === 'Escape')))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.closeAll();
        trigger.focus();
      });
  }

  protected closeAll(): void {
    if (this.active) {
      this.active.ref.dispose();
      this.active = null;
    }
    this.openId.set(null);
  }

  /** Menubar keyboard navigation: ArrowLeft/Right antar trigger, Home/End, ArrowDown fokus panel. */
  protected onMenubarKeydown(event: KeyboardEvent): void {
    const key = event.key;
    const root = this.host.nativeElement;
    const triggers = Array.from(
      root.querySelectorAll<HTMLElement>('ul[role="menubar"] [role="menuitem"]'),
    ).filter((el) => !el.hasAttribute('disabled'));
    if (triggers.length === 0) return;
    const currentIndex = triggers.indexOf(document.activeElement as HTMLElement);

    if (key === 'ArrowDown' && currentIndex !== -1) {
      event.preventDefault();
      // Jika open, fokus item pertama panel; jika belum, focus tetap (panel akan dibuka via click/mouseenter).
      queueMicrotask(() => this.focusFirstInPanel());
      return;
    }
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;
    let nextIndex = currentIndex;
    if (key === 'ArrowRight') nextIndex = (currentIndex + 1 + triggers.length) % triggers.length;
    else if (key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    else if (key === 'Home') nextIndex = 0;
    else if (key === 'End') nextIndex = triggers.length - 1;
    if (nextIndex !== currentIndex && triggers[nextIndex]) {
      event.preventDefault();
      triggers[nextIndex].focus();
    }
  }

  /** Arrow-key navigation dalam dropdown/mega panel. */
  protected onPanelKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (
      key !== 'ArrowDown' &&
      key !== 'ArrowUp' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      key !== 'Home' &&
      key !== 'End'
    )
      return;
    const panel = this.active?.ref.overlayElement;
    if (!panel) return;
    const items = this.collectPanelFocusables(panel);
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    let nextIndex = currentIndex;
    if (key === 'ArrowDown' || key === 'ArrowRight')
      nextIndex = (currentIndex + 1 + items.length) % items.length;
    else if (key === 'ArrowUp' || key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (key === 'Home') nextIndex = 0;
    else if (key === 'End') nextIndex = items.length - 1;
    if (nextIndex !== currentIndex && items[nextIndex]) {
      event.preventDefault();
      items[nextIndex].focus();
    }
  }

  private collectPanelFocusables(root: HTMLElement): HTMLElement[] {
    return Array.from(
      root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
  }

  private focusFirstInPanel(): void {
    const panel = this.active?.ref.overlayElement;
    if (!panel) return;
    const items = this.collectPanelFocusables(panel);
    items[0]?.focus();
  }
}
