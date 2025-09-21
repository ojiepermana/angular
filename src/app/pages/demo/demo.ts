import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeToggle } from '../../layouts/components/shared/dark-mode-toggle.component';
import { VerticalNavigation } from '../../../../projects/kit/src/lib/components/navigation/vertical/vertical-navigation';
import { HorizontalNavigation } from '../../../../projects/kit/src/lib/components/navigation/horizontal/horizontal-navigation';
import { NavigationService } from '../../../../projects/kit/src/lib/services/navigation.service';
import { demoNavigationData } from './navigations';

@Component({
  selector: 'demo-page',
  imports: [RouterOutlet, DarkModeToggle, VerticalNavigation, HorizontalNavigation],
  host: {
    'class': 'flex flex-col h-full'
  },
  template: `
    <!-- Header -->
        <header class="flex-shrink-0 p-2 border-b">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L3 18L12 22L21 18L22 7L12 2Z" fill="#DD0031"/>
                <path d="M12 2V22L21 18L22 7L12 2Z" fill="#C3002F"/>
                <path d="M12 5.5L8.5 17H10.4L11.1 15H12.9L13.6 17H15.5L12 5.5Z" fill="white"/>
                <path d="M12 8.5L11.4 12H12.6L12 8.5Z" fill="white"/>
              </svg>
              <h1 class="text-lg font-semibold">Angular Kit - Navigation Demo</h1>
            </div>
            <div class="flex items-center gap-4">
              <dark-mode-toggle
                [iconStyle]="'default'"
                [borderStyle]="'none'"
              />
            </div>
          </div>
        </header>

        <!-- Horizontal Navigation -->
        <div class="flex-shrink-0 border-b bg-background">
          <div class="px-4 py-2">
            <div class="mb-2">
              <h3 class="text-sm font-medium text-muted-foreground">Horizontal Navigation</h3>
            </div>
            <op-horizontal-navigation
              name="demo-horizontal"
              [navigation]="navigationData">
            </op-horizontal-navigation>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Vertical Navigation Sidebar -->
          <aside class="flex-shrink-0 w-72 border-r overflow-y-auto">
            <div class="p-4">
              <h3 class="text-sm font-medium text-muted-foreground mb-3">Vertical Navigation</h3>
              <op-vertical-navigation
                name="demo-vertical"
                [navigation]="navigationData">
              </op-vertical-navigation>
            </div>
          </aside>

          <!-- Page Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="max-w-4xl mx-auto">
              <div class="mb-6">
                <h2 class="text-2xl font-bold mb-2">Navigation Components Demo</h2>
                <p class="text-muted-foreground">
                  This demo showcases both horizontal and vertical navigation components running simultaneously.
                  Both components share the same navigation data and demonstrate different layout approaches.
                </p>
              </div>

              <div class="grid gap-6 md:grid-cols-2">
                <div class="p-4 border rounded-lg">
                  <h3 class="font-semibold mb-2">Horizontal Navigation Features</h3>
                  <ul class="text-sm text-muted-foreground space-y-1">
                    <li>• Scrollable horizontal layout</li>
                    <li>• Dropdown support for collapsable items</li>
                    <li>• Responsive design</li>
                    <li>• Badge and icon support</li>
                  </ul>
                </div>

                <div class="p-4 border rounded-lg">
                  <h3 class="font-semibold mb-2">Vertical Navigation Features</h3>
                  <ul class="text-sm text-muted-foreground space-y-1">
                    <li>• Hierarchical structure</li>
                    <li>• Collapsable groups</li>
                    <li>• Dividers and spacers</li>
                    <li>• Active state management</li>
                  </ul>
                </div>
              </div>

              <router-outlet/>
            </div>
          </div>
        </div>
  `,
  styles: `
    .rotate-180 {
      transform: rotate(180deg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPage implements OnInit {
  private _navigationService = inject(NavigationService);

  navigationData = demoNavigationData;

  ngOnInit(): void {
    // Store navigation data in service for global access
    this._navigationService.storeNavigation(demoNavigationData);
  }
}
