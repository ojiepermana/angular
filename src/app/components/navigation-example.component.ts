import { Component, inject, signal, computed } from '@angular/core';
import { NavigationDataService } from '../services/navigation-data.service';
import { VerticalNavigation } from '../../../projects/kit/src/lib/components/navigation/vertical/vertical-navigation';
import { HorizontalNavigation } from '../../../projects/kit/src/lib/components/navigation/horizontal/horizontal-navigation';
import { NavigationItem } from '../../../projects/kit/src/lib/types/navigations.type';

@Component({
  selector: 'app-navigation-example',
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-2xl font-bold">Navigation Service Example</h2>
      
      <!-- Example 1: Using NavigationDataService with Horizontal Navigation -->
      <div class="border rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">Horizontal Navigation (Global Service)</h3>
        <op-horizontal-navigation
          name="example-horizontal"
          [navigation]="navigationService.navigationData()"
        />
      </div>

      <!-- Example 2: Using NavigationDataService with Vertical Navigation -->
      <div class="border rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">Vertical Navigation (Global Service)</h3>
        <div class="h-96 overflow-y-auto">
          <op-vertical-navigation
            name="example-vertical"
            [navigation]="navigationService.navigationData()"
          />
        </div>
      </div>

      <!-- Example 3: Get specific navigation items -->
      <div class="border rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">Service Methods Examples</h3>
        
        <div class="space-y-4">
          <!-- Search for specific item -->
          <div>
            <h4 class="font-medium">Find Navigation Item by ID:</h4>
            <button 
              class="px-3 py-1 bg-blue-500 text-white rounded mr-2"
              (click)="searchItem('material-components')"
            >
              Find Material Components
            </button>
            <button 
              class="px-3 py-1 bg-green-500 text-white rounded"
              (click)="searchItem('angular-cdk')"
            >
              Find Angular CDK
            </button>
            @if (foundItem()) {
              <div class="mt-2 p-2 bg-gray-100 rounded">
                <strong>Found:</strong> {{ foundItem()?.title }} ({{ foundItem()?.type }})
              </div>
            }
          </div>

          <!-- Get breadcrumb path -->
          <div>
            <h4 class="font-medium">Get Breadcrumb Path:</h4>
            <button 
              class="px-3 py-1 bg-purple-500 text-white rounded mr-2"
              (click)="getBreadcrumb('button')"
            >
              Path to Button Component
            </button>
            <button 
              class="px-3 py-1 bg-orange-500 text-white rounded"
              (click)="getBreadcrumb('drag-drop')"
            >
              Path to Drag Drop
            </button>
            @if (breadcrumbPath().length > 0) {
              <div class="mt-2 p-2 bg-gray-100 rounded">
                <strong>Path:</strong> 
                @for (item of breadcrumbPath(); track item.id; let isLast = $last) {
                  {{ item.title }}@if (!isLast) { → }
                }
              </div>
            }
          </div>

          <!-- Filter by type -->
          <div>
            <h4 class="font-medium">Filter Items by Type:</h4>
            <button 
              class="px-3 py-1 bg-indigo-500 text-white rounded mr-2"
              (click)="filterByType('basic')"
            >
              All Basic Items ({{ basicItems().length }})
            </button>
            <button 
              class="px-3 py-1 bg-pink-500 text-white rounded"
              (click)="filterByType('collapsable')"
            >
              All Collapsable Items ({{ collapsableItems().length }})
            </button>
          </div>

          <!-- Display filtered results -->
          @if (filteredItems().length > 0) {
            <div class="mt-4 p-4 bg-gray-50 rounded max-h-48 overflow-y-auto">
              <h5 class="font-medium mb-2">Filtered Results ({{ filteredItems().length }} items):</h5>
              <ul class="space-y-1">
                @for (item of filteredItems(); track item.id) {
                  <li class="text-sm">
                    <span class="font-medium">{{ item.title }}</span>
                    <span class="text-gray-500 ml-2">({{ item.type }})</span>
                    @if (item.link) {
                      <span class="text-blue-500 ml-2">→ {{ item.link }}</span>
                    }
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </div>

      <!-- Example 4: Stats from navigation data -->
      <div class="border rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">Navigation Statistics</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-3 bg-blue-50 rounded">
            <div class="text-2xl font-bold text-blue-600">{{ totalItems() }}</div>
            <div class="text-sm text-blue-800">Total Items</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded">
            <div class="text-2xl font-bold text-green-600">{{ basicItems().length }}</div>
            <div class="text-sm text-green-800">Basic Items</div>
          </div>
          <div class="text-center p-3 bg-purple-50 rounded">
            <div class="text-2xl font-bold text-purple-600">{{ collapsableItems().length }}</div>
            <div class="text-sm text-purple-800">Collapsable Items</div>
          </div>
          <div class="text-center p-3 bg-orange-50 rounded">
            <div class="text-2xl font-bold text-orange-600">{{ groupItems().length }}</div>
            <div class="text-sm text-orange-800">Group Items</div>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [VerticalNavigation, HorizontalNavigation]
})
export class NavigationExampleComponent {
  // Inject NavigationDataService
  navigationService = inject(NavigationDataService);

  // Signals for component state
  foundItem = signal<NavigationItem | null>(null);
  breadcrumbPath = signal<NavigationItem[]>([]);
  filteredItems = signal<NavigationItem[]>([]);

  // Computed values for stats
  basicItems = computed(() => this.navigationService.getItemsByType('basic'));
  collapsableItems = computed(() => this.navigationService.getItemsByType('collapsable'));
  groupItems = computed(() => this.navigationService.getItemsByType('group'));
  
  totalItems = computed(() => {
    return this.countAllItems(this.navigationService.navigationData());
  });

  // Method to search for a specific item
  searchItem(id: string): void {
    const item = this.navigationService.getNavigationItem(id);
    this.foundItem.set(item);
  }

  // Method to get breadcrumb path
  getBreadcrumb(id: string): void {
    const path = this.navigationService.getBreadcrumbPath(id);
    this.breadcrumbPath.set(path);
  }

  // Method to filter items by type
  filterByType(type: NavigationItem['type']): void {
    const items = this.navigationService.getItemsByType(type);
    this.filteredItems.set(items);
  }

  // Helper method to count all items recursively
  private countAllItems(items: NavigationItem[]): number {
    let count = 0;
    for (const item of items) {
      count++;
      if (item.children) {
        count += this.countAllItems(item.children);
      }
    }
    return count;
  }
}