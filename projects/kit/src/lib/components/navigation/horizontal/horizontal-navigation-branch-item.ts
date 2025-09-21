import { ChangeDetectionStrategy, Component, input, output, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { NavigationItem } from '../../../types/navigations.type';

@Component({
  selector: 'op-horizontal-navigation-branch-item',
  template: `
    <!-- Trigger Button -->
    <div
      class="relative inline-flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors whitespace-nowrap"
      [matMenuTriggerFor]="matMenu"
      (menuOpened)="onMenuOpened()"
      (menuClosed)="onMenuClosed()"
      #trigger="matMenuTrigger"
    >
      @if (item().icon) {
        <mat-icon class="mr-2 text-base">{{ item().icon }}</mat-icon>
      }
      <span>{{ item().title }}</span>
      @if (item().badge?.title) {
        <span
          class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
          [class.bg-primary]="!item().badge?.classes"
          [class.text-primary-foreground]="!item().badge?.classes"
          [ngClass]="item().badge?.classes"
        >
          {{ item().badge?.title }}
        </span>
      }
      <mat-icon class="ml-1 text-sm">expand_more</mat-icon>
    </div>

    <!-- Dropdown Menu -->
    <mat-menu #matMenu="matMenu" class="op-horizontal-navigation-menu" [hasBackdrop]="true">
      @for (child of item().children || []; track child.id || child.title) {
        @if (child.type === 'basic') {
          <div mat-menu-item class="px-0">
            @if (child.link) {
              <a
                [routerLink]="child.link"
                [title]="child.tooltip"
                class="flex items-center w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                (click)="onChildItemClicked(child)"
              >
                @if (child.icon) {
                  <mat-icon class="mr-2 text-base">{{ child.icon }}</mat-icon>
                }
                <span>{{ child.title }}</span>
                @if (child.badge?.title) {
                  <span
                    class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                    [class.bg-primary]="!child.badge?.classes"
                    [class.text-primary-foreground]="!child.badge?.classes"
                    [ngClass]="child.badge?.classes"
                  >
                    {{ child.badge?.title }}
                  </span>
                }
              </a>
            } @else {
              <div
                class="flex items-center w-full px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                [title]="child.tooltip"
                (click)="onChildItemClicked(child)"
              >
                @if (child.icon) {
                  <mat-icon class="mr-2 text-base">{{ child.icon }}</mat-icon>
                }
                <span>{{ child.title }}</span>
                @if (child.badge?.title) {
                  <span
                    class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                    [class.bg-primary]="!child.badge?.classes"
                    [class.text-primary-foreground]="!child.badge?.classes"
                    [ngClass]="child.badge?.classes"
                  >
                    {{ child.badge?.title }}
                  </span>
                }
              </div>
            }
          </div>
        }
        @if (child.type === 'divider') {
          <mat-divider></mat-divider>
        }
        @if (child.type === 'group' && child.children) {
          <div class="px-3 py-1">
            <div class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {{ child.title }}
            </div>
          </div>
          @for (groupChild of child.children; track groupChild.id || groupChild.title) {
            @if (groupChild.type === 'basic') {
              <div mat-menu-item class="px-0">
                @if (groupChild.link) {
                  <a
                    [routerLink]="groupChild.link"
                    [title]="groupChild.tooltip"
                    class="flex items-center w-full px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                    (click)="onChildItemClicked(groupChild)"
                  >
                    @if (groupChild.icon) {
                      <mat-icon class="mr-2 text-base">{{ groupChild.icon }}</mat-icon>
                    }
                    <span>{{ groupChild.title }}</span>
                  </a>
                } @else {
                  <div
                    class="flex items-center w-full px-6 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                    [title]="groupChild.tooltip"
                    (click)="onChildItemClicked(groupChild)"
                  >
                    @if (groupChild.icon) {
                      <mat-icon class="mr-2 text-base">{{ groupChild.icon }}</mat-icon>
                    }
                    <span>{{ groupChild.title }}</span>
                  </div>
                }
              </div>
            }
          }
        }
      }
    </mat-menu>
  `,
  styles: `
    .op-horizontal-navigation-menu {
      min-width: 200px;
      z-index: 1000;
    }

    .op-horizontal-navigation-menu .mat-mdc-menu-item {
      min-height: auto;
      line-height: normal;
    }

    :host ::ng-deep .cdk-overlay-pane {
      z-index: 1000 !important;
    }
  `,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterLink,
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalNavigationBranchItem {
  @ViewChild('matMenu', { static: true }) matMenu!: MatMenu;

  // Input for navigation item
  item = input.required<NavigationItem>();

  // Output for item clicks
  itemClicked = output<NavigationItem>();

  onChildItemClicked(child: NavigationItem): void {
    this.itemClicked.emit(child);
  }

  onMenuOpened(): void {
    console.log('Menu opened');
  }

  onMenuClosed(): void {
    console.log('Menu closed');
  }
}
