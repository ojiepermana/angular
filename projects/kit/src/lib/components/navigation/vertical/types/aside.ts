import { Component, computed, inject, input, output, OnInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { NavigationItem } from '../../../../types/navigations.type';
import { NavigationStateService } from '../../../../services/navigation-state.service';

// Import child components for rendering children
import { VerticalNavigationBasicItem } from './basic';
import { VerticalNavigationCollapsableItem } from './collapsable';
import { VerticalNavigationGroupItem } from './group';
import { VerticalNavigationDividerItem } from './divider';

@Component({
  selector: 'op-vertical-navigation-aside-item',
  template: `
    <!-- Aside content wrapper (following contekan pattern) -->
    <div
      class="op-navigation-item-wrapper"
      [class.op-navigation-item-has-subtitle]="!!item().subtitle"
      [ngClass]="item().classes?.wrapper"
    >
      <!-- Item content -->
      <div
        class="op-navigation-item"
        [class.op-navigation-item-active]="active()"
        [class.op-navigation-item-disabled]="item().disabled"
        [class.op-navigation-item-active-forced]="item().active"
        [attr.title]="item().tooltip || ''"
      >
        <!-- Icon -->
        @if (item().icon) {
          <mat-icon
            class="op-navigation-item-icon"
            [ngClass]="item().classes?.icon"
          >
            {{ item().icon }}
          </mat-icon>
        }

        <!-- Title & Subtitle -->
        <div class="op-navigation-item-title-wrapper">
          <div class="op-navigation-item-title">
            <span [ngClass]="item().classes?.title">
              {{ item().title }}
            </span>
          </div>
          @if (item().subtitle) {
            <div class="op-navigation-item-subtitle">
              <span [ngClass]="item().classes?.subtitle">
                {{ item().subtitle }}
              </span>
            </div>
          }
        </div>

        <!-- Badge -->
        @if (item().badge?.title) {
          <div class="op-navigation-item-badge">
            <div
              class="op-navigation-item-badge-content"
              [ngClass]="item().badge?.classes"
            >
              {{ item().badge?.title }}
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Children content (following contekan pattern) -->
    @if (!skipChildren() && item().children?.length) {
      <div class="op-navigation-item-children">
        @for (childItem of item().children; track trackByFn($index, childItem)) {
          <!-- Skip the hidden items -->
          @if ((childItem.hidden && !childItem.hidden(childItem)) || !childItem.hidden) {
            <!-- Basic -->
            @if (childItem.type === 'basic') {
              <op-vertical-navigation-basic-item
                [item]="childItem"
                [variant]="variant()"
                (itemClicked)="onChildItemClicked($event)"
              />
            }
            <!-- Collapsable -->
            @if (childItem.type === 'collapsable') {
              <op-vertical-navigation-collapsable-item
                [item]="childItem"
                [variant]="variant()"
                (itemClicked)="onChildItemClicked($event)"
              />
            }
            <!-- Group -->
            @if (childItem.type === 'group') {
              <op-vertical-navigation-group-item
                [item]="childItem"
                [variant]="variant()"
                (itemClicked)="onChildItemClicked($event)"
              />
            }
            <!-- Divider -->
            @if (childItem.type === 'divider') {
              <op-vertical-navigation-divider-item
                [item]="childItem"
                [variant]="variant()"
              />
            }
            <!-- Spacer -->
            @if (childItem.type === 'spacer') {
              <div class="op-navigation-spacer h-4"></div>
            }
          }
        }
      </div>
    }
  `,
  imports: [
    NgClass,
    MatIconModule,
    VerticalNavigationBasicItem,
    VerticalNavigationCollapsableItem,
    VerticalNavigationGroupItem,
    VerticalNavigationDividerItem
  ]
})
export class VerticalNavigationAsideItem implements OnInit, OnDestroy {
  // Inputs
  item = input.required<NavigationItem>();
  variant = input<'default' | 'glass'>('default');
  activeItemId = input<string>('');
  autoCollapse = input<boolean>(true);
  skipChildren = input<boolean>(false);

  // Outputs
  itemClicked = output<NavigationItem>();

  // Injected services
  private _router = inject(Router);
  private _navigationStateService = inject(NavigationStateService);

  // Private properties
  private _unsubscribeAll = new Subject<void>();

  // Computed active state
  active = computed(() => {
    const itemId = this.item().id;
    const activeId = this.activeItemId();

    // Check if the activeItemId equals this item id
    if (activeId && itemId === activeId) {
      return true;
    }

    // Check if this item is active via navigation state service
    if (itemId && this._navigationStateService.isItemActive(itemId)) {
      return true;
    }

    // Check if any child is active
    return this._hasActiveChild(this.item(), this._router.url);
  });

  ngOnInit(): void {
    // Listen to router events to update active state
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        // Active state will be automatically recalculated via computed signal
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Track by function for ngFor loops
   */
  trackByFn(index: number, item: NavigationItem): any {
    return item.id || index;
  }

  /**
   * Handle item click
   */
  onItemClick(): void {
    const itemId = this.item().id;

    if (itemId) {
      this._navigationStateService.setActiveItem(itemId);
    }

    this.itemClicked.emit(this.item());
  }

  /**
   * Handle child item click
   */
  onChildItemClicked(childItem: NavigationItem): void {
    this.itemClicked.emit(childItem);
  }

  /**
   * Check if the given item has an active child
   */
  private _hasActiveChild(item: NavigationItem, currentUrl: string): boolean {
    const children = item.children;

    if (!children) {
      return false;
    }

    for (const child of children) {
      if (child.children) {
        if (this._hasActiveChild(child, currentUrl)) {
          return true;
        }
      }

      // Skip items other than 'basic'
      if (child.type !== 'basic') {
        continue;
      }

      // Check if the child has a link and is active
      if (child.link && this._router.isActive(child.link, child.exactMatch || false)) {
        return true;
      }
    }

    return false;
  }
}
