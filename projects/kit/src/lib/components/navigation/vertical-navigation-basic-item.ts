import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem } from '../../types/navigations.type';

@Component({
  selector: 'op-vertical-navigation-basic-item',
  template: `
    <div class="op-navigation-item">
      @if (item().link) {
        <a
          [routerLink]="item().link"
          [title]="item().tooltip"
          class="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          (click)="itemClicked.emit(item())"
        >
          @if (item().icon) {
            <mat-icon class="mr-3 text-lg">{{ item().icon }}</mat-icon>
          }
          <span>{{ item().title }}</span>
        </a>
      } @else {
        <div
          class="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
          [title]="item().tooltip"
          (click)="itemClicked.emit(item())"
        >
          @if (item().icon) {
            <mat-icon class="mr-3 text-lg">{{ item().icon }}</mat-icon>
          }
          <span>{{ item().title }}</span>
        </div>
      }
    </div>
  `,
  imports: [RouterLink, MatIconModule]
})
export class VerticalNavigationBasicItem {
  item = input.required<NavigationItem>();
  itemClicked = output<NavigationItem>();
}
