import { Component, input, output, inject, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationItem, VerticalNavigationAppearance, VerticalNavigationMode, VerticalNavigationPosition } from '../../../types/navigations.type';
import { NavigationService } from '../../../services/navigation.service';
import { VerticalNavigationBasicItem } from './vertical-navigation-basic-item';
import { VerticalNavigationCollapsableItem } from './vertical-navigation-collapsable-item';
import { VerticalNavigationGroupItem } from './vertical-navigation-group-item';
import { VerticalNavigationDividerItem } from './vertical-navigation-divider-item';

@Component({
  selector: 'op-vertical-navigation',
  host: {
    '[class]': 'glassClass()'
  },
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

  // Computed glass class for host binding
  glassClass = computed(() => {
    const currentVariant = this.variant();
    const currentAppearance = this.appearance();

    // Glass variant only available for 'compact', 'dense', 'thin' appearances
    if (currentVariant === 'glass' && ['compact', 'dense', 'thin'].includes(currentAppearance)) {
      return 'op-vertical-navigation-glass';
    }

    return '';
  });

  // Additional inputs inspired by contekan
  appearance = input<'default' | 'compact' | 'dense' | 'thin'>('default');
  mode = input<'over' | 'side'>('side');
  position = input<'left' | 'right'>('left');
  autoCollapse = input<boolean>(false);

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
