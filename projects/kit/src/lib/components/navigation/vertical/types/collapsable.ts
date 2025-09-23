import { Component, input, output, signal, inject, computed, forwardRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem } from '../../../../types/navigations.type';
import { VerticalNavigationBasicItem } from './basic';
import { VerticalNavigationDividerItem } from './divider';
import { NavigationStateService } from '../../../../services/navigation-state.service';

@Component({
  selector: 'op-vertical-navigation-collapsable-item',
  host: {
    '[class]': 'glassClass()'
  },
  template: `
    <div
      class="op-navigation-item-wrapper"
      [class.op-navigation-item-has-subtitle]="!!item().subtitle"
      [ngClass]="item().classes?.wrapper"
    >
      <!-- Parent item -->
      <div
        class="op-navigation-item"
        [class.op-navigation-item-active]="isExpanded()"
        [class.op-navigation-item-disabled]="item().disabled"
        [class.op-navigation-item-active-forced]="item().active"
        [title]="item().tooltip || ''"
        (click)="toggleExpanded()"
      >
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

        <!-- Arrow -->
        <div class="op-navigation-item-arrow">
          <mat-icon class="text-base transition-transform duration-200" [class.rotate-180]="isExpanded()">
            keyboard_arrow_down
          </mat-icon>
        </div>
      </div>

      <!-- Children -->
      @if (isExpanded() && item().children) {
        <div class="op-navigation-item-children">
          @for (child of item().children; track child.id || child.title) {
            @switch (child.type) {
              @case ('basic') {
                <op-vertical-navigation-basic-item
                  [item]="child"
                  [variant]="variant()"
                  (itemClicked)="onChildItemClicked($event)"
                />
              }
              @case ('collapsable') {
                <op-vertical-navigation-collapsable-item
                  [item]="child"
                  [variant]="variant()"
                  (itemClicked)="onChildItemClicked($event)"
                />
              }
              @case ('divider') {
                <op-vertical-navigation-divider-item
                  [item]="child"
                  [variant]="variant()"
                />
              }
              @default {
                <!-- Default to basic item for items without explicit type -->
                <op-vertical-navigation-basic-item
                  [item]="child"
                  [variant]="variant()"
                  (itemClicked)="onChildItemClicked($event)"
                />
              }
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .rotate-180 {
      transform: rotate(180deg);
    }
  `],
  imports: [
    VerticalNavigationBasicItem,
    MatIconModule,
    NgClass,
    VerticalNavigationDividerItem,
    forwardRef(() => VerticalNavigationCollapsableItem)
  ]
})
export class VerticalNavigationCollapsableItem {
  item = input.required<NavigationItem>();
  variant = input<'default' | 'glass'>('default');
  itemClicked = output<NavigationItem>();

  // Computed glass class for host binding
  glassClass = computed(() => {
    return this.variant() === 'glass' ? 'op-vertical-navigation-collapsable-item-glass' : '';
  });

  // Inject NavigationStateService
  private _navigationStateService = inject(NavigationStateService);

  // Computed expanded state using service
  isExpanded = computed(() => {
    const itemId = this.item().id;
    return itemId ? this._navigationStateService.isItemExpanded(itemId) : false;
  });

  toggleExpanded(): void {
    const itemId = this.item().id;

    if (itemId) {
      this._navigationStateService.toggleExpanded(itemId);
    }

    // For collapsable items, we don't emit itemClicked on toggle
    // to prevent sidebar from closing. Only emit on child clicks.
  }

  onChildItemClicked(item: NavigationItem): void {
    // Set active item for basic items
    if (item.id && item.type === 'basic') {
      this._navigationStateService.setActiveItem(item.id);
    }

    this.itemClicked.emit(item);
  }
}
