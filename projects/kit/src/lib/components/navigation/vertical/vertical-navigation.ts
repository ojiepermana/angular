import { Component, input, output, inject, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem} from '../../../types/navigations.type';
import { NavigationService } from '../../../services/navigation.service';
import { VerticalNavigationBasicItem } from './types/vertical-navigation-basic-item';
import { VerticalNavigationCollapsableItem } from './types/vertical-navigation-collapsable-item';
import { VerticalNavigationGroupItem } from './types/vertical-navigation-group-item';
import { VerticalNavigationDividerItem } from './types/vertical-navigation-divider-item';
import { VerticalNavigationAsideItem } from './types/vertical-navigation-aside-item';

/**
 * Vertical Navigation Component
 *
 * A comprehensive vertical navigation component with multiple appearance modes,
 * glass variant support, and flexible positioning options.
 *
 * Features:
 * - Multiple appearances: default, compact, dense, thin
 * - Glass variant support for compact/dense/thin appearances
 * - Flexible positioning: left/right
 * - Multiple modes: side/over
 * - Programmable open/close states
 * - Event emissions for all property changes
 *
 * @example
 * ```html
 * <op-vertical-navigation
 *   [navigation]="navigationItems"
 *   appearance="compact"
 *   variant="glass"
 *   position="left"
 *   mode="side"
 *   [opened]="true"
 *   (itemClicked)="onItemClicked($event)"
 *   (appearanceChanged)="onAppearanceChanged($event)">
 * </op-vertical-navigation>
 * ```
 */
@Component({
  selector: 'op-vertical-navigation',
  host: {
    '[class]': 'hostClasses()',
    '[style.visibility]': 'opened() ? "visible" : "hidden"'
  },
  styleUrl: `./vertical-navigation.css`,
  template: `
    <div class="op-navigation-container relative">
      <nav class="op-vertical-navigation">
      @if (navigationData()) {
        <div class="space-y-1">
          @for (item of navigationData(); track item.id || item.title) {
            @switch (item.type) {
              @case ('basic') {
                <op-vertical-navigation-basic-item
                  [item]="item"
                  [variant]="effectiveVariant()"
                  (itemClicked)="onItemClicked($event)"
                />
              }
              @case ('collapsable') {
                <op-vertical-navigation-collapsable-item
                  [item]="item"
                  [variant]="effectiveVariant()"
                  (itemClicked)="onItemClicked($event)"
                />
              }
              @case ('group') {
                <op-vertical-navigation-group-item
                  [item]="item"
                  [variant]="effectiveVariant()"
                  (itemClicked)="onItemClicked($event)"
                />
              }
              @case ('aside') {
                <op-vertical-navigation-aside-item
                  [item]="item"
                  [variant]="effectiveVariant()"
                  [appearance]="appearance()"
                  (itemClicked)="onItemClicked($event)"
                />
              }
              @case ('divider') {
                <op-vertical-navigation-divider-item
                  [item]="item"
                  [variant]="effectiveVariant()" />
              }
              @case ('spacer') {
                <div class="op-vertical-navigation-spacer h-4"></div>
              }
              @default {
                <op-vertical-navigation-basic-item
                  [item]="item"
                  [variant]="effectiveVariant()"
                  (itemClicked)="onItemClicked($event)"
                />
              }
            }
          }
        </div>
      }
    </nav>

    <!-- Expandable Aside Sidebar (for thin mode) -->
    @if (appearance() === 'thin' && activeAsideId()) {
      <!-- Backdrop/Overlay for click-outside to close -->
      <div
        class="op-aside-overlay absolute inset-0 bg-black/20 z-40"
        (click)="closeAside()">
      </div>

      <!-- Expandable Sidebar -->
      <div
        class="op-aside-sidebar absolute top-0 z-50 h-full w-64 bg-background border shadow-lg"
        [style.left.px]="position() === 'left' ? 52 : null"
        [style.right.px]="position() === 'right' ? 52 : null"
      >
        @for (item of navigationData(); track item.id || item.title) {
          @if (item.type === 'aside' && (item.id || item.title) && isAsideActive(item.id || item.title || '')) {
            <div class="h-full flex flex-col">
              <!-- Sidebar Header -->
              <div class="px-4 py-3 border-b">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3 flex-1">
                    @if (item.icon) {
                      <mat-icon class="text-lg">{{ item.icon }}</mat-icon>
                    }
                    <div class="flex-1">
                      @if (item.title) {
                        <h3 class="font-medium">{{ item.title }}</h3>
                      }
                      @if (item.subtitle) {
                        <p class="text-sm text-muted-foreground">{{ item.subtitle }}</p>
                      }
                    </div>
                  </div>
                  <button
                    class="p-1 rounded hover:bg-muted transition-colors"
                    (click)="closeAside()"
                  >
                    <mat-icon class="text-sm">close</mat-icon>
                  </button>
                </div>
              </div>

              <!-- Sidebar Content - Scrollable -->
              <div class="flex-1 overflow-y-auto p-2">
                @if (item.children && item.children.length > 0) {
                  <div class="space-y-1">
                    @for (child of item.children; track child.id || child.title) {
                      @switch (child.type) {
                        @case ('basic') {
                          <op-vertical-navigation-basic-item
                            [item]="child"
                            [variant]="effectiveVariant()"
                            (itemClicked)="onSidebarItemClicked($event)"
                          />
                        }
                        @case ('collapsable') {
                          <op-vertical-navigation-collapsable-item
                            [item]="child"
                            [variant]="effectiveVariant()"
                            (itemClicked)="onSidebarItemClicked($event)"
                          />
                        }
                        @case ('group') {
                          <op-vertical-navigation-group-item
                            [item]="child"
                            [variant]="effectiveVariant()"
                            (itemClicked)="onSidebarItemClicked($event)"
                          />
                        }
                        @case ('aside') {
                          <op-vertical-navigation-aside-item
                            [item]="child"
                            [variant]="effectiveVariant()"
                            (itemClicked)="onSidebarItemClicked($event)"
                          />
                        }
                        @case ('divider') {
                          <op-vertical-navigation-divider-item
                            [item]="child"
                            [variant]="effectiveVariant()"
                          />
                        }
                        @default {
                          <!-- Default case for items without explicit type -->
                          <op-vertical-navigation-basic-item
                            [item]="child"
                            [variant]="effectiveVariant()"
                            (itemClicked)="onSidebarItemClicked($event)"
                          />
                        }
                      }
                    }
                  </div>
                } @else {
                  <div class="p-4 text-center text-muted-foreground">
                    <p class="text-sm">No items available</p>
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    }
  </div>
  `,
  imports: [
    MatIconModule,
    VerticalNavigationBasicItem,
    VerticalNavigationCollapsableItem,
    VerticalNavigationGroupItem,
    VerticalNavigationDividerItem,
    VerticalNavigationAsideItem
  ]
})
export class VerticalNavigation implements OnInit, OnDestroy {
  // Inject NavigationService
  private _navigationService = inject(NavigationService);

  // Navigation name identifier
  name = input<string>('');

  // Navigation data input (for direct data binding)
  navigation = input<NavigationItem[]>([]);

  // Glass variant support
  variant = input<'default' | 'glass'>('default');

  // Additional inputs inspired by contekan
  appearance = input<'default' | 'compact' | 'dense' | 'thin'>('default');
  mode = input<'over' | 'side'>('side');
  position = input<'left' | 'right'>('left');
  opened = input<boolean>(true);
  autoCollapse = input<boolean>(false);

  // Computed host classes for comprehensive styling
  hostClasses = computed(() => {
    const currentAppearance = this.appearance();
    const currentMode = this.mode();
    const currentPosition = this.position();
    const currentOpened = this.opened();
    const currentVariant = this.variant();

    const classes: string[] = [
      'op-vertical-navigation',
      `op-vertical-navigation-appearance-${currentAppearance}`,
      `op-vertical-navigation-mode-${currentMode}`,
      `op-vertical-navigation-position-${currentPosition}`
    ];

    if (currentOpened) {
      classes.push('op-vertical-navigation-opened');
    }

    // Add glass class for specific appearances and glass variant
    if (currentVariant === 'glass' && ['compact', 'dense', 'thin'].includes(currentAppearance)) {
      classes.push('op-vertical-navigation-glass');
    }

    return classes.join(' ');
  });

  // Computed glass class for backward compatibility (deprecated - use hostClasses instead)
  glassClass = computed(() => {
    const currentVariant = this.variant();
    const currentAppearance = this.appearance();

    // Glass variant only available for 'compact', 'dense', 'thin' appearances
    if (currentVariant === 'glass' && ['compact', 'dense', 'thin'].includes(currentAppearance)) {
      return 'op-vertical-navigation-glass';
    }

    return '';
  });

  // Computed variant for child components (only glass for specific appearances)
  effectiveVariant = computed(() => {
    const currentVariant = this.variant();
    const currentAppearance = this.appearance();

    if (currentVariant === 'glass' && ['compact', 'dense', 'thin'].includes(currentAppearance)) {
      return 'glass';
    }

    return 'default';
  });

  // Output for item clicks
  itemClicked = output<NavigationItem>();

  // Output events for property changes (following contekan pattern)
  appearanceChanged = output<'default' | 'compact' | 'dense' | 'thin'>();
  modeChanged = output<'over' | 'side'>();
  positionChanged = output<'left' | 'right'>();
  openedChanged = output<boolean>();

  // Computed navigation data that supports both direct input and service-based approach
  navigationData = computed(() => {
    const directNavigation = this.navigation();

    // Use direct navigation input when provided, otherwise
    // fall back to the navigation stored in the service
    if (directNavigation?.length) {
      return directNavigation;
    }

    return this._navigationService.getNavigation();
  });

  /**
   * Handle item click
   */
  onItemClicked(item: NavigationItem): void {
    this.itemClicked.emit(item);
  }

  /**
   * Toggle navigation opened state
   */
  toggle(): void {
    const currentOpened = this.opened();
    this.openedChanged.emit(!currentOpened);
  }

  /**
   * Open navigation
   */
  open(): void {
    if (!this.opened()) {
      this.openedChanged.emit(true);
    }
  }

  /**
   * Close navigation
   */
  close(): void {
    if (this.opened()) {
      this.openedChanged.emit(false);
    }
  }

  /**
   * Set appearance
   */
  setAppearance(appearance: 'default' | 'compact' | 'dense' | 'thin'): void {
    if (this.appearance() !== appearance) {
      this.appearanceChanged.emit(appearance);
    }
  }

  /**
   * Set mode
   */
  setMode(mode: 'over' | 'side'): void {
    if (this.mode() !== mode) {
      this.modeChanged.emit(mode);
    }
  }

  /**
   * Set position
   */
  setPosition(position: 'left' | 'right'): void {
    if (this.position() !== position) {
      this.positionChanged.emit(position);
    }
  }

  /**
   * Get flat navigation for utility purposes
   */
  getFlatNavigation(): NavigationItem[] {
    return this._navigationService.getFlatNavigation(this.navigationData());
  }

  /**
   * Get navigation item by ID
   */
  getItem(id: string): NavigationItem | null {
    return this._navigationService.getItem(id, this.navigationData());
  }

  /**
   * Get navigation item parent by ID
   */
  getItemParent(id: string): NavigationItem[] | NavigationItem | null {
    return this._navigationService.getItemParent(id, this.navigationData(), this.navigationData());
  }

  // Aside expandable state management (for thin mode)
  private _activeAsideId = signal<string | null>(null);
  activeAsideId = this._activeAsideId.asReadonly();

  /**
   * Toggle aside (for thin mode)
   */
  toggleAside(asideId: string): void {
    const currentActiveId = this._activeAsideId();

    if (currentActiveId === asideId) {
      // Close if already open
      this._activeAsideId.set(null);
    } else {
      // Open the aside
      this._activeAsideId.set(asideId);
    }
  }

  /**
   * Close aside (for thin mode)
   */
  closeAside(): void {
    this._activeAsideId.set(null);
  }

  /**
   * Check if aside is active/expanded
   */
  isAsideActive(asideId: string): boolean {
    return this._activeAsideId() === asideId;
  }

  /**
   * Handle sidebar item click and close sidebar
   */
  onSidebarItemClicked(item: NavigationItem): void {
    this.itemClicked.emit(item);
    this.closeAside(); // Auto-close sidebar after item selection
  }

  /**
   * Lifecycle: Initialize component
   */
  ngOnInit(): void {
    // Listen for aside header clicks from child components
    if (typeof window !== 'undefined') {
      window.addEventListener('aside-header-clicked', this.handleAsideHeaderClick.bind(this));
    }
  }

  /**
   * Lifecycle: Cleanup component
   */
  ngOnDestroy(): void {
    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('aside-header-clicked', this.handleAsideHeaderClick.bind(this));
    }
  }

  /**
   * Handle aside header click events from child components
   */
  private handleAsideHeaderClick(event: any): void {
    const { asideId } = event.detail;
    if (asideId) {
      this.toggleAside(asideId);
    }
  }
}
