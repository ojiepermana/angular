import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem } from '../../../../types/navigations.type';
import { NavigationStateService } from '../../../../services/navigation-state.service';

@Component({
  selector: 'op-vertical-navigation-basic-item',
  host: {
    '[class]': 'glassClass()'
  },
  template: `
    <div class="op-navigation-item">
      @if (item().link) {
        <a
          [routerLink]="item().link"
          [title]="item().tooltip"
          class="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          [class.bg-accent]="isActive()"
          [class.text-accent-foreground]="isActive()"
          (click)="onItemClick()"
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
        </a>
      } @else {
        <div
          class="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
          [class.bg-accent]="isActive()"
          [class.text-accent-foreground]="isActive()"
          [title]="item().tooltip"
          (click)="onItemClick()"
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
        </div>
      }
    </div>
  `,
  imports: [RouterLink, MatIconModule, NgClass]
})
export class VerticalNavigationBasicItem {
  item = input.required<NavigationItem>();
  variant = input<'default' | 'glass'>('default');
  itemClicked = output<NavigationItem>();

  // Computed glass class for host binding
  glassClass = computed(() => {
    return this.variant() === 'glass' ? 'op-vertical-navigation-basic-item-glass' : '';
  });

  // Inject NavigationStateService
  private _navigationStateService = inject(NavigationStateService);

  // Check if this item is active
  isActive = computed(() => {
    const itemId = this.item().id;
    return itemId ? this._navigationStateService.isItemActive(itemId) : false;
  });

  onItemClick(): void {
    // Set this item as active
    const itemId = this.item().id;
    if (itemId) {
      this._navigationStateService.setActiveItem(itemId);
    }

    this.itemClicked.emit(this.item());
  }
}
