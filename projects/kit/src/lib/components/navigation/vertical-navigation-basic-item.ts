import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from './types';

@Component({
  selector: 'op-vertical-navigation-basic-item',
  template: `
    <div class="op-navigation-item">
      @if (item().link) {
        <a
          [routerLink]="item().link"
          [title]="item().tooltip"
          class="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
          (click)="itemClicked.emit(item())"
        >
          @if (item().icon) {
            <span class="mr-3 text-lg">{{ item().icon }}</span>
          }
          <span>{{ item().title }}</span>
        </a>
      } @else {
        <div
          class="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
          [title]="item().tooltip"
          (click)="itemClicked.emit(item())"
        >
          @if (item().icon) {
            <span class="mr-3 text-lg">{{ item().icon }}</span>
          }
          <span>{{ item().title }}</span>
        </div>
      }
    </div>
  `,
  imports: [RouterLink, RouterLinkActive]
})
export class VerticalNavigationBasicItem {
  item = input.required<NavigationItem>();
  itemClicked = output<NavigationItem>();
}
