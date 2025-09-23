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
    <div
      class="op-navigation-item-wrapper"
      [class.op-navigation-item-has-subtitle]="!!item().subtitle"
      [ngClass]="item().classes?.wrapper"
    >
      @if (item().link) {
        <a
          [routerLink]="item().link"
          [title]="item().tooltip"
          class="op-navigation-item"
          [class.op-navigation-item-active]="isActive()"
          [class.op-navigation-item-disabled]="item().disabled"
          [class.op-navigation-item-active-forced]="item().active"
          (click)="onItemClick()"
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
        </a>
      } @else {
        <div
          class="op-navigation-item"
          [class.op-navigation-item-active]="isActive()"
          [class.op-navigation-item-disabled]="item().disabled"
          [class.op-navigation-item-active-forced]="item().active"
          [title]="item().tooltip"
          (click)="onItemClick()"
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
