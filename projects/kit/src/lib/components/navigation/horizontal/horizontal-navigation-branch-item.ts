import { ChangeDetectionStrategy, Component, input, output, ViewChild, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { NavigationItem } from '../../../types/navigations.type';

@Component({
  selector: 'op-horizontal-navigation-branch-item',
  host: {
    '[class.glass-variant]': 'variant() === "glass"',
    '[class.op-glass-navigation]': 'variant() === "glass"'
  },
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

    <!-- Main Dropdown Menu -->
    <mat-menu #matMenu="matMenu" class="op-horizontal-navigation-menu" [ngClass]="glassClass()" [hasBackdrop]="true">
      @for (child of item().children || []; track child.id || child.title) {

        <!-- Basic Item -->
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

        <!-- Collapsable Item (Level 2) -->
        @if (child.type === 'collapsable' && child.children) {
          <div
            mat-menu-item
            class="px-0"
            [matMenuTriggerFor]="level2Menu"
            #level2Trigger="matMenuTrigger"
          >
            <div class="flex items-center w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded transition-colors">
              @if (child.icon) {
                <mat-icon class="mr-2 text-base">{{ child.icon }}</mat-icon>
              }
              <span class="flex-1">{{ child.title }}</span>
              @if (child.badge?.title) {
                <span
                  class="mx-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                  [class.bg-primary]="!child.badge?.classes"
                  [class.text-primary-foreground]="!child.badge?.classes"
                  [ngClass]="child.badge?.classes"
                >
                  {{ child.badge?.title }}
                </span>
              }
            </div>
          </div>

          <!-- Level 2 Sub-Menu -->
          <mat-menu #level2Menu="matMenu" class="op-horizontal-navigation-menu" [ngClass]="glassClass()">
            @for (level2Child of child.children; track level2Child.id || level2Child.title) {

              <!-- Basic Item in Level 2 -->
              @if (level2Child.type === 'basic') {
                <div mat-menu-item class="px-0">
                  @if (level2Child.link) {
                    <a
                      [routerLink]="level2Child.link"
                      [title]="level2Child.tooltip"
                      class="flex items-center w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                      (click)="onChildItemClicked(level2Child)"
                    >
                      @if (level2Child.icon) {
                        <mat-icon class="mr-2 text-base">{{ level2Child.icon }}</mat-icon>
                      }
                      <span>{{ level2Child.title }}</span>
                      @if (level2Child.badge?.title) {
                        <span
                          class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                          [class.bg-primary]="!level2Child.badge?.classes"
                          [class.text-primary-foreground]="!level2Child.badge?.classes"
                          [ngClass]="level2Child.badge?.classes"
                        >
                          {{ level2Child.badge?.title }}
                        </span>
                      }
                    </a>
                  } @else {
                    <div
                      class="flex items-center w-full px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                      [title]="level2Child.tooltip"
                      (click)="onChildItemClicked(level2Child)"
                    >
                      @if (level2Child.icon) {
                        <mat-icon class="mr-2 text-base">{{ level2Child.icon }}</mat-icon>
                      }
                      <span>{{ level2Child.title }}</span>
                      @if (level2Child.badge?.title) {
                        <span
                          class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                          [class.bg-primary]="!level2Child.badge?.classes"
                          [class.text-primary-foreground]="!level2Child.badge?.classes"
                          [ngClass]="level2Child.badge?.classes"
                        >
                          {{ level2Child.badge?.title }}
                        </span>
                      }
                    </div>
                  }
                </div>
              }

              <!-- Collapsable Item in Level 2 (Level 3) -->
              @if (level2Child.type === 'collapsable' && level2Child.children) {
                <div
                  mat-menu-item
                  class="px-0"
                  [matMenuTriggerFor]="level3Menu"
                  #level3Trigger="matMenuTrigger"
                >
                  <div class="flex items-center w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded transition-colors">
                    @if (level2Child.icon) {
                      <mat-icon class="mr-2 text-base">{{ level2Child.icon }}</mat-icon>
                    }
                    <span class="flex-1">{{ level2Child.title }}</span>
                    @if (level2Child.badge?.title) {
                      <span
                        class="mx-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                        [class.bg-primary]="!level2Child.badge?.classes"
                        [class.text-primary-foreground]="!level2Child.badge?.classes"
                        [ngClass]="level2Child.badge?.classes"
                      >
                        {{ level2Child.badge?.title }}
                      </span>
                    }
                  </div>
                </div>

                <!-- Level 3 Sub-Menu -->
                <mat-menu #level3Menu="matMenu" class="op-horizontal-navigation-menu" [ngClass]="glassClass()">
                  @for (level3Child of level2Child.children; track level3Child.id || level3Child.title) {
                    @if (level3Child.type === 'basic') {
                      <div mat-menu-item class="px-0">
                        @if (level3Child.link) {
                          <a
                            [routerLink]="level3Child.link"
                            [title]="level3Child.tooltip"
                            class="flex items-center w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                            (click)="onChildItemClicked(level3Child)"
                          >
                            @if (level3Child.icon) {
                              <mat-icon class="mr-2 text-base">{{ level3Child.icon }}</mat-icon>
                            }
                            <span>{{ level3Child.title }}</span>
                            @if (level3Child.badge?.title) {
                              <span
                                class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                                [class.bg-primary]="!level3Child.badge?.classes"
                                [class.text-primary-foreground]="!level3Child.badge?.classes"
                                [ngClass]="level3Child.badge?.classes"
                              >
                                {{ level3Child.badge?.title }}
                              </span>
                            }
                          </a>
                        } @else {
                          <div
                            class="flex items-center w-full px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                            [title]="level3Child.tooltip"
                            (click)="onChildItemClicked(level3Child)"
                          >
                            @if (level3Child.icon) {
                              <mat-icon class="mr-2 text-base">{{ level3Child.icon }}</mat-icon>
                            }
                            <span>{{ level3Child.title }}</span>
                            @if (level3Child.badge?.title) {
                              <span
                                class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                                [class.bg-primary]="!level3Child.badge?.classes"
                                [class.text-primary-foreground]="!level3Child.badge?.classes"
                                [ngClass]="level3Child.badge?.classes"
                              >
                                {{ level3Child.badge?.title }}
                              </span>
                            }
                          </div>
                        }
                      </div>
                    }
                  }
                </mat-menu>
              }
            }
          </mat-menu>
        }

        <!-- Group Item -->
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

        <!-- Divider -->
        @if (child.type === 'divider') {
          <mat-divider></mat-divider>
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

    /* Glass effect for mat-menu using host class */
    :host.glass-variant ::ng-deep .mat-mdc-menu-panel {
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      background-color: rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37) !important;
    }

    /* Dark mode glass effect using host class */
    :root.dark :host.glass-variant ::ng-deep .mat-mdc-menu-panel {
      background-color: rgba(0, 0, 0, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
    }

    /* Original glass effect for mat-menu */
    :host ::ng-deep .glass-menu .mat-mdc-menu-panel {
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      background-color: rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37) !important;
    }

    /* Dark mode glass effect */
    :root.dark :host ::ng-deep .glass-menu .mat-mdc-menu-panel {
      background-color: rgba(0, 0, 0, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
    }

    /* Alternative selector for glass effect */
    :host ::ng-deep .mat-mdc-menu-panel.glass-menu {
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      background-color: rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37) !important;
    }

    /* Dark mode for alternative selector */
    :root.dark :host ::ng-deep .mat-mdc-menu-panel.glass-menu {
      background-color: rgba(0, 0, 0, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
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

  // Variant input for glass effect
  variant = input<'default' | 'glass'>('default');

  // Output for item clicks
  itemClicked = output<NavigationItem>();

  // Computed glass class for mat-menu
  glassClass = computed(() => {
    return this.variant() === 'glass' ? 'glass-menu' : '';
  });

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
