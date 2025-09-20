import { Component, input, output } from '@angular/core';
import { NavigationItem } from './types';
import { VerticalNavigationBasicItem } from './vertical-navigation-basic-item';
import { VerticalNavigationCollapsableItem } from './vertical-navigation-collapsable-item';
import { VerticalNavigationGroupItem } from './vertical-navigation-group-item';
import { VerticalNavigationDividerItem } from './vertical-navigation-divider-item';

@Component({
  selector: 'op-vertical-navigation',
  template: `
    <nav class="op-vertical-navigation">
      @if (navigation()) {
        <div class="space-y-1">
          @for (item of navigation(); track item.id || item.title) {
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
  navigation = input.required<NavigationItem[]>();
  itemClicked = output<NavigationItem>();

  onItemClicked(item: NavigationItem): void {
    this.itemClicked.emit(item);
  }
}
