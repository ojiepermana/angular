import { Component, input, output, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem} from '../../../types/navigations.type';
import { NavigationService } from '../../../services/navigation.service';
import { VerticalNavigationBasicItem } from './types/basic';
import { VerticalNavigationCollapsableItem } from './types/collapsable';
import { VerticalNavigationGroupItem } from './types/group';
import { VerticalNavigationDividerItem } from './types/divider';
import { VerticalNavigationAsideItem } from './types/aside';

@Component({
  selector: 'op-vertical-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
                <div
                  class="op-navigation-item cursor-pointer"
                  [class.op-navigation-item-active]="(item.id || item.title) === activeAsideItemId"
                  [class.op-navigation-item-disabled]="item.disabled"
                  [class.op-navigation-item-active-forced]="item.active"
                  [attr.title]="item.tooltip || ''"
                  (click)="toggleAside(item)"
                >
                  <!-- Icon -->
                  @if (item.icon) {
                    <mat-icon
                      class="op-navigation-item-icon"
                      [class]="item.classes?.icon"
                    >
                      {{ item.icon }}
                    </mat-icon>
                  }

                  <!-- Title & Subtitle -->
                  <div class="op-navigation-item-title-wrapper">
                    <div class="op-navigation-item-title">
                      <span [class]="item.classes?.title">
                        {{ item.title }}
                      </span>
                    </div>
                    @if (item.subtitle) {
                      <div class="op-navigation-item-subtitle">
                        <span [class]="item.classes?.subtitle">
                          {{ item.subtitle }}
                        </span>
                      </div>
                    }
                  </div>

                  <!-- Badge -->
                  @if (item.badge?.title) {
                    <div class="op-navigation-item-badge">
                      <div
                        class="op-navigation-item-badge-content"
                        [class]="item.badge?.classes"
                      >
                        {{ item.badge?.title }}
                      </div>
                    </div>
                  }
                </div>
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
  </div>

  <!-- Aside -->
  @if (activeAsideItemId) {
    <div class="op-vertical-navigation-aside-wrapper">
      <!-- Items -->
      @for (item of navigationData(); track item.id || item.title) {
        <!-- Skip the hidden items -->
        @if ((item.hidden && !item.hidden(item)) || !item.hidden) {
          <!-- Aside -->
          @if (item.type === 'aside' && (item.id || item.title) === activeAsideItemId) {
            <op-vertical-navigation-aside-item
              [item]="item"
              [variant]="effectiveVariant()"
              [activeItemId]="activeAsideItemId || ''"
              [autoCollapse]="autoCollapse()"
              [skipChildren]="false"
              (itemClicked)="onItemClicked($event)"
            />
          }
        }
      }
    </div>
  }
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
export class VerticalNavigation {
  constructor() {
    // Component initialization using constructor pattern
  }

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

  // Aside expandable state management (following contekan pattern)
  activeAsideItemId: string | null = null;

  /**
   * Toggle aside (matching contekan pattern)
   */
  toggleAside(item: NavigationItem): void {
    const asideId = item.id || item.title;
    const currentActiveId = this.activeAsideItemId;

    if (currentActiveId === asideId) {
      // Close if already open
      this.activeAsideItemId = null;
    } else {
      // Open the aside
      this.activeAsideItemId = asideId || null;
    }
  }

  /**
   * Close aside
   */
  closeAside(): void {
    this.activeAsideItemId = null;
  }
}
