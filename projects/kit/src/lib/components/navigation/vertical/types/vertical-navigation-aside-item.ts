import { Component, input, output, forwardRef, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem } from '../../../../types/navigations.type';
import { VerticalNavigationBasicItem } from './vertical-navigation-basic-item';
import { VerticalNavigationCollapsableItem } from './vertical-navigation-collapsable-item';
import { VerticalNavigationGroupItem } from './vertical-navigation-group-item';
import { VerticalNavigationDividerItem } from './vertical-navigation-divider-item';

@Component({
  selector: 'op-vertical-navigation-aside-item',
  host: {
    '[class]': 'glassClass()'
  },
  template: `
    @if (appearance() === 'thin') {
      <!-- Thin mode: Show as icon-only clickable item like basic -->
      <div
        class="op-navigation-item"
        (click)="onAsideHeaderClick()"
      >
        @if (item().icon) {
          <mat-icon>{{ item().icon }}</mat-icon>
        }
      </div>
    } @else {
      <!-- Default mode: Show full aside content -->
      <div class="op-navigation-aside">
        <!-- Aside Header -->
        <div
          class="py-3 border-b border-color cursor-pointer"
          (click)="onAsideHeaderClick()"
        >
          <div class="flex items-start space-x-3">
            @if (item().icon) {
              <div class="flex-shrink-0">
                <mat-icon class="text-lg text-muted-foreground">{{ item().icon }}</mat-icon>
              </div>
            }
            @if (item().badge?.title) {
              <div class="flex-shrink-0">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [class.bg-primary]="!item().badge?.classes"
                  [class.text-primary-foreground]="!item().badge?.classes"
                  [ngClass]="item().badge?.classes"
                >
                  {{ item().badge?.title }}
                </span>
              </div>
            }
          </div>
        </div>

        <!-- Aside Content -->
        @if (item().children) {
          <div class="p-2 space-y-1">
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
                  @case ('group') {
                    <op-vertical-navigation-group-item
                      [item]="child"
                      [variant]="variant()"
                      (itemClicked)="onChildItemClicked($event)"
                    />
                  }
                  @case ('aside') {
                    <op-vertical-navigation-aside-item
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
              }
            }
          </div>
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
    VerticalNavigationDividerItem,
    forwardRef(() => VerticalNavigationAsideItem)
  ]
})
export class VerticalNavigationAsideItem {
  item = input.required<NavigationItem>();
  variant = input<'default' | 'glass'>('default');
  appearance = input<'default' | 'compact' | 'dense' | 'thin'>('default'); // Add appearance input
  itemClicked = output<NavigationItem>();

  // Computed glass class for host binding
  glassClass = computed(() => {
    return this.variant() === 'glass' ? 'op-vertical-navigation-aside-item-glass' : '';
  });

  onChildItemClicked(item: NavigationItem): void {
    this.itemClicked.emit(item);
  }

  onAsideHeaderClick(): void {
    // Create a custom event to communicate with parent navigation
    const event = new CustomEvent('aside-header-clicked', {
      detail: {
        asideId: this.item().id || this.item().title,
        item: this.item()
      },
      bubbles: true
    });

    // Dispatch the event to be caught by parent navigation
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }

    // Also emit through itemClicked for consistency
    this.itemClicked.emit(this.item());
  }
}
