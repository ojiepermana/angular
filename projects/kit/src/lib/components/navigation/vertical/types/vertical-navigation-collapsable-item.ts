import { Component, input, output, signal, inject, computed, forwardRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem } from '../../../../types/navigations.type';
import { VerticalNavigationBasicItem } from './vertical-navigation-basic-item';
import { VerticalNavigationDividerItem } from './vertical-navigation-divider-item';
import { NavigationStateService } from '../../../../services/navigation-state.service';

@Component({
  selector: 'op-vertical-navigation-collapsable-item',
  host: {
    '[class]': 'glassClass()'
  },
  template: `
    <div class="op-navigation-collapsable">
      <!-- Parent item -->
      <div
        class="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
        [class.bg-accent]="isExpanded()"
        [class.text-accent-foreground]="isExpanded()"
        (click)="toggleExpanded()"
      >
        @if (item().icon) {
          <mat-icon class="mr-3 text-lg">{{ item().icon }}</mat-icon>
        }
        <span class="flex-1">{{ item().title }}</span>
        @if (item().badge?.title) {
          <span
            class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            [class.bg-primary]="!item().badge?.classes"
            [class.text-primary-foreground]="!item().badge?.classes"
            [ngClass]="item().badge?.classes"
          >
            {{ item().badge?.title }}
          </span>
        }
        <span class="text-base font-bold transition-transform duration-200 w-4 h-4 flex items-center justify-center">
          {{ isExpanded() ? '-' : '+' }}
        </span>
      </div>

      <!-- Children -->
      @if (isExpanded() && item().children) {
        <div class="ml-6 mt-1 space-y-1">
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
