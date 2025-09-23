import { Component, input, output, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationItem } from '../../../types/navigations.type';
import { NavigationService } from '../../../services/navigation.service';
import { HorizontalNavigationBranchItem } from './horizontal-navigation-branch-item';

@Component({
  selector: 'op-horizontal-navigation',
  template: `
    <nav class="op-horizontal-navigation">
      @if (navigationData()) {
        <div class="flex items-center space-x-1 overflow-x-auto pb-2">
          @for (item of navigationData(); track item.id || item.title) {
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
                <!-- Collapsable Item with Dropdown -->
                @if (item.children && item.children.length > 0) {
                  <op-horizontal-navigation-branch-item
                    [item]="item"
                    [variant]="variant()"
                    (itemClicked)="onItemClicked($event)"
                  />
                } @else {
                  <!-- Fallback to basic item if no children -->
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
                    </div>
                  }
                }
              }

              @case ('group') {
                <!-- Group Item with Dropdown -->
                @if (item.children && item.children.length > 0) {
                  <op-horizontal-navigation-branch-item
                    [item]="item"
                    [variant]="variant()"
                    (itemClicked)="onItemClicked($event)"
                  />
                } @else {
                  <!-- Fallback to basic item if no children -->
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
                    </div>
                  }
                }
              }

              @case ('divider') {
                <!-- Divider -->
                <div class="w-px h-6 bg-border mx-2"></div>
              }

              @case ('spacer') {
                <!-- Spacer -->
                <div class="flex-1"></div>
              }

              @default {
                <!-- Default to basic item -->
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
                  </div>
                }
              }
            }
          }
        </div>
      }
    </nav>
  `,
  styles: `
    .op-horizontal-navigation {
      @apply w-full;
    }

    .op-horizontal-navigation .flex {
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }

    .op-horizontal-navigation .flex::-webkit-scrollbar {
      height: 4px;
    }

    .op-horizontal-navigation .flex::-webkit-scrollbar-track {
      background: transparent;
    }

    .op-horizontal-navigation .flex::-webkit-scrollbar-thumb {
      background: rgba(156, 163, 175, 0.5);
      border-radius: 2px;
    }

    .op-horizontal-navigation .flex::-webkit-scrollbar-thumb:hover {
      background: rgba(156, 163, 175, 0.8);
    }

    .rotate-180 {
      transform: rotate(180deg);
    }
  `,
  imports: [
    RouterLink,
    NgClass,
    MatIconModule,
    MatMenuModule,
    HorizontalNavigationBranchItem
  ]
})
export class HorizontalNavigation {
  private _navigationService = inject(NavigationService);

  // Navigation name identifier
  name = input<string>('');

  // Input for navigation data
  navigation = input<NavigationItem[]>([]);

  // Glass variant support
  variant = input<'default' | 'glass'>('default');

  // Additional inputs inspired by contekan for consistency
  appearance = input<'default' | 'compact' | 'dense' | 'thin'>('default');
  mode = input<'over' | 'side'>('side');
  position = input<'left' | 'right'>('left');
  autoCollapse = input<boolean>(false);

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
