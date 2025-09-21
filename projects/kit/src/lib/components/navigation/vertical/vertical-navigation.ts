import { Component, input, output, inject, computed } from '@angular/core';
import { NavigationItem } from '../../../types/navigations.type';
import { NavigationService } from '../../../services/navigation.service';
import { VerticalNavigationBasicItem } from './vertical-navigation-basic-item';
import { VerticalNavigationCollapsableItem } from './vertical-navigation-collapsable-item';
import { VerticalNavigationGroupItem } from './vertical-navigation-group-item';
import { VerticalNavigationDividerItem } from './vertical-navigation-divider-item';

@Component({
  selector: 'op-vertical-navigation',
  template: `
    <nav class="op-vertical-navigation">
      @if (navigationData()) {
        <div class="space-y-1">
          @for (item of navigationData(); track item.id || item.title) {
            @switch (item.type) {
              @case ('basic') {
                <op-vertical-navigation-basic-item
                  [item]="item"
                  (itemClicked)="onItemClicked($event)"
                />
              }
              @case ('collapsable') {
                <op-vertical-navigation-collapsable-item
                  [item]="item"
                  (itemClicked)="onItemClicked($event)"
                />
              }
              @case ('group') {
                <op-vertical-navigation-group-item
                  [item]="item"
                  (itemClicked)="onItemClicked($event)"
                />
              }
              @case ('divider') {
                <op-vertical-navigation-divider-item [item]="item" />
              }
              @default {
                <op-vertical-navigation-basic-item
                  [item]="item"
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

  // Navigation data input (for direct data binding)
  navigation = input<NavigationItem[]>([]);

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
