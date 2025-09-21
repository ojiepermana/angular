import { Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem } from '../../../types/navigations.type';
import { VerticalNavigationBasicItem } from './vertical-navigation-basic-item';

@Component({
  selector: 'op-vertical-navigation-collapsable-item',
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
                  (itemClicked)="onChildItemClicked($event)"
                />
              }
              @case ('collapsable') {
                <op-vertical-navigation-collapsable-item
                  [item]="child"
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
  imports: [VerticalNavigationBasicItem, MatIconModule, NgClass]
})
export class VerticalNavigationCollapsableItem {
  item = input.required<NavigationItem>();
  itemClicked = output<NavigationItem>();

  isExpanded = signal(false);

  toggleExpanded(): void {
    this.isExpanded.update(expanded => !expanded);
    this.itemClicked.emit(this.item());
  }

  onChildItemClicked(item: NavigationItem): void {
    this.itemClicked.emit(item);
  }
}
