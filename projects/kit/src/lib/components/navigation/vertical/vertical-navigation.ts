import { Component, input, output, inject, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationItem, VerticalNavigationAppearance, VerticalNavigationMode, VerticalNavigationPosition } from '../../../types/navigations.type';
import { NavigationService } from '../../../services/navigation.service';
import { VerticalNavigationBasicItem } from './types/vertical-navigation-basic-item';
import { VerticalNavigationCollapsableItem } from './types/vertical-navigation-collapsable-item';
import { VerticalNavigationGroupItem } from './types/vertical-navigation-group-item';
import { VerticalNavigationDividerItem } from './types/vertical-navigation-divider-item';

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
  `,
  imports: [
    VerticalNavigationBasicItem,
    VerticalNavigationCollapsableItem,
    VerticalNavigationGroupItem,
    VerticalNavigationDividerItem
  ]
})
export class VerticalNavigation {
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
}
