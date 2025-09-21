import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem } from '../../../types/navigations.type';

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
          [title]="item().tooltip"
          (click)="itemClicked.emit(item())"
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
  itemClicked = output<NavigationItem>();
}
