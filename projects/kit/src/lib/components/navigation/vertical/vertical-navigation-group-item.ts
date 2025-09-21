import { Component, input, output, forwardRef } from '@angular/core';
import { NavigationItem } from '../../../types/navigations.type';
import { VerticalNavigationBasicItem } from './vertical-navigation-basic-item';
import { VerticalNavigationCollapsableItem } from './vertical-navigation-collapsable-item';

@Component({
  selector: 'op-vertical-navigation-group-item',
  template: `
    <div class="op-navigation-group">
      @if (item().title) {
        <div class="px-4 py-2">
          <div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {{ item().title }}
          </div>
          @if (item().subtitle) {
            <div class="text-xs text-muted-foreground/70 mt-0.5 normal-case tracking-normal">
              {{ item().subtitle }}
            </div>
          }
        </div>
      }

      @if (item().children) {
        <div class="space-y-1">
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
              @case ('group') {
                <op-vertical-navigation-group-item
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
  imports: [
    VerticalNavigationBasicItem,
    VerticalNavigationCollapsableItem,
    forwardRef(() => VerticalNavigationGroupItem)
  ]
})
export class VerticalNavigationGroupItem {
  item = input.required<NavigationItem>();
  itemClicked = output<NavigationItem>();

  onChildItemClicked(item: NavigationItem): void {
    this.itemClicked.emit(item);
  }
}
