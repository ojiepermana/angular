import { Component, input, output, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem } from '../../../types/navigations.type';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'op-horizontal-navigation',
  template: `
    <nav class="op-horizontal-navigation">
      @if (navigationData()) {
        <div class="flex items-center space-x-1 overflow-x-auto pb-2">
          @for (item of flattenedNavigationData(); track item.id || item.title) {
            @if (item.type !== 'divider' && item.type !== 'group') {
              @switch (item.type) {
                @case ('basic') {
                  <!-- Basic Item -->
                  @if (item.link) {
                    <a
                      [routerLink]="item.link"
                      [title]="item.tooltip"
                      class="flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap"
                      (click)="onItemClicked(item)"
                    >
                      @if (item.icon) {
                        <mat-icon class="mr-2 text-base">{{ item.icon }}</mat-icon>
                      }
                      <span>{{ item.title }}</span>
                      @if (item.badge?.title) {
                        <span
                          class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                          [class.bg-primary]="!item.badge?.classes"
                          [class.text-primary-foreground]="!item.badge?.classes"
                          [ngClass]="item.badge?.classes"
                        >
                          {{ item.badge?.title }}
                        </span>
                      }
                    </a>
                  } @else {
                    <div
                      class="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap"
                      [title]="item.tooltip"
                      (click)="onItemClicked(item)"
                    >
                      @if (item.icon) {
                        <mat-icon class="mr-2 text-base">{{ item.icon }}</mat-icon>
                      }
                      <span>{{ item.title }}</span>
                      @if (item.badge?.title) {
                        <span
                          class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                          [class.bg-primary]="!item.badge?.classes"
                          [class.text-primary-foreground]="!item.badge?.classes"
                          [ngClass]="item.badge?.classes"
                        >
                          {{ item.badge?.title }}
                        </span>
                      }
                    </div>
                  }
                }
                @case ('collapsable') {
                  <!-- Collapsable Item -->
                  <div class="relative">
                    <div
                      class="flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors whitespace-nowrap"
                      [class.bg-accent]="isExpanded(item.id || item.title || '')"
                      [class.text-accent-foreground]="isExpanded(item.id || item.title || '')"
                      (click)="toggleExpanded(item.id || item.title || '')"
                    >
                      @if (item.icon) {
                        <mat-icon class="mr-2 text-base">{{ item.icon }}</mat-icon>
                      }
                      <span>{{ item.title }}</span>
                      @if (item.badge?.title) {
                        <span
                          class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                          [class.bg-primary]="!item.badge?.classes"
                          [class.text-primary-foreground]="!item.badge?.classes"
                          [ngClass]="item.badge?.classes"
                        >
                          {{ item.badge?.title }}
                        </span>
                      }
                      <mat-icon class="ml-1 text-sm transition-transform duration-200"
                                [class.rotate-180]="isExpanded(item.id || item.title || '')">
                        expand_more
                      </mat-icon>
                    </div>

                    <!-- Dropdown Children -->
                    @if (isExpanded(item.id || item.title || '') && item.children) {
                      <div class="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg z-50 min-w-48">
                        <div class="py-1 space-y-0.5">
                          @for (child of item.children; track child.id || child.title) {
                            @if (child.type === 'basic') {
                              <div class="px-1">
                                @if (child.link) {
                                  <a
                                    [routerLink]="child.link"
                                    [title]="child.tooltip"
                                    class="flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                                    (click)="onChildItemClicked(child, item.id || item.title || '')"
                                  >
                                    @if (child.icon) {
                                      <mat-icon class="mr-2 text-base">{{ child.icon }}</mat-icon>
                                    }
                                    <span>{{ child.title }}</span>
                                  </a>
                                } @else {
                                  <div
                                    class="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                                    [title]="child.tooltip"
                                    (click)="onChildItemClicked(child, item.id || item.title || '')"
                                  >
                                    @if (child.icon) {
                                      <mat-icon class="mr-2 text-base">{{ child.icon }}</mat-icon>
                                    }
                                    <span>{{ child.title }}</span>
                                  </div>
                                }
                              </div>
                            }
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
                @default {
                  <!-- Default to basic -->
                  @if (item.link) {
                    <a
                      [routerLink]="item.link"
                      [title]="item.tooltip"
                      class="flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap"
                      (click)="onItemClicked(item)"
                    >
                      @if (item.icon) {
                        <mat-icon class="mr-2 text-base">{{ item.icon }}</mat-icon>
                      }
                      <span>{{ item.title }}</span>
                    </a>
                  }
                }
              }
            }
          }
        </div>
      }
    </nav>
  `,
  imports: [RouterLink, NgClass, MatIconModule],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'closeAllDropdowns()'
  },
  styles: `
    .op-horizontal-navigation {
      @apply w-full;
    }

    .op-horizontal-navigation .flex {
      @apply scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent;
    }

    .op-horizontal-navigation .flex::-webkit-scrollbar {
      height: 4px;
    }

    .op-horizontal-navigation .flex::-webkit-scrollbar-track {
      background: transparent;
    }

    .op-horizontal-navigation .flex::-webkit-scrollbar-thumb {
      background: rgb(209 213 219);
      border-radius: 2px;
    }

    .op-horizontal-navigation .flex::-webkit-scrollbar-thumb:hover {
      background: rgb(156 163 175);
    }

    .rotate-180 {
      transform: rotate(180deg);
    }

    .op-horizontal-navigation .absolute {
      @apply bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700;
    }

    .op-horizontal-navigation a:hover {
      @apply bg-gray-100 dark:bg-gray-800;
    }

    .op-horizontal-navigation a.router-link-active {
      @apply bg-primary text-primary-foreground;
    }

    .op-horizontal-navigation a.router-link-active:hover {
      @apply bg-primary/90;
    }
  `
})
export class HorizontalNavigation {
  private _navigationService = inject(NavigationService);
  private _expandedItems = signal<Set<string>>(new Set());

  // Input for navigation data
  navigation = input<NavigationItem[]>([]);

  // Output for item clicks
  itemClicked = output<NavigationItem>();

  // Computed navigation data (from input or service)
  navigationData = computed(() => {
    const inputData = this.navigation();
    if (inputData.length > 0) {
      return inputData;
    }
    return this._navigationService.getNavigation();
  });

  // Flatten navigation data for horizontal display
  flattenedNavigationData = computed(() => {
    const data = this.navigationData();
    return this.flattenNavigation(data);
  });

  /**
   * Flatten navigation items for horizontal display
   * Extracts children from groups and collapsable items
   */
  private flattenNavigation(items: NavigationItem[]): NavigationItem[] {
    const flattened: NavigationItem[] = [];

    for (const item of items) {
      if (item.type === 'group' && item.children) {
        // Add group items directly
        flattened.push(...this.flattenNavigation(item.children));
      } else if (item.type === 'collapsable') {
        // Add the collapsable item itself
        flattened.push(item);
      } else if (item.type !== 'divider') {
        // Add regular items (except dividers)
        flattened.push(item);
      }
    }

    return flattened;
  }

  /**
   * Check if item is expanded
   */
  isExpanded(itemId: string): boolean {
    return this._expandedItems().has(itemId);
  }

  /**
   * Toggle item expansion
   */
  toggleExpanded(itemId: string): void {
    this._expandedItems.update(expanded => {
      const newSet = new Set(expanded);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }

  /**
   * Close all dropdowns
   */
  closeAllDropdowns(): void {
    this._expandedItems.set(new Set());
  }

  /**
   * Handle item click events
   */
  onItemClicked(item: NavigationItem): void {
    // Execute function if available
    if (item.function) {
      item.function(item);
    }

    this.itemClicked.emit(item);
  }

  /**
   * Handle child item click events
   */
  onChildItemClicked(item: NavigationItem, parentId: string): void {
    // Close the dropdown
    this._expandedItems.update(expanded => {
      const newSet = new Set(expanded);
      newSet.delete(parentId);
      return newSet;
    });

    // Execute function if available
    if (item.function) {
      item.function(item);
    }

    this.itemClicked.emit(item);
  }

  /**
   * Handle document click to close dropdowns
   */
  onDocumentClick(event: Event): void {
    const target = event.target as Element;
    const navigationElement = (event.currentTarget as Element)?.querySelector('.op-horizontal-navigation');

    if (navigationElement && !navigationElement.contains(target)) {
      this.closeAllDropdowns();
    }
  }

  /**
   * Track function for ngFor
   */
  trackByFn(index: number, item: NavigationItem): string {
    return item.id || item.title || index.toString();
  }
}
