import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerticalMiniDockLayout } from '../components/shared/vertical-mini-dock';
import { DarkModeToggle } from '../components/shared/dark-mode-toggle.component';
import { VerticalNavigation } from '../../../../projects/kit/src/lib/components/navigation/vertical/vertical-navigation';
import { HorizontalNavigation } from '../../../../projects/kit/src/lib/components/navigation/horizontal/horizontal-navigation';
import { NavigationService } from '../../../../projects/kit/src/lib/services/navigation.service';
import { NavigationDataService } from '../../services';

@Component({
  selector: 'layout-default',
  imports: [RouterOutlet, VerticalMiniDockLayout, DarkModeToggle, VerticalNavigation, HorizontalNavigation],
  template: `
    <div class="flex h-screen">
      <vertical-mini-dock-layout></vertical-mini-dock-layout>
      <!-- Main Content Area -->
      <div id="content" class="flex flex-1 flex-col overflow-hidden">
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
            <op-horizontal-navigation
              name="demo-horizontal"
              [navigation]="navigationData()">
            </op-horizontal-navigation>
        </div>

        <!-- Main Content -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Vertical Navigation Sidebar -->
          <aside class="flex-shrink-0 w-72 border-r overflow-y-auto">
              <op-vertical-navigation
                name="demo-vertical"
                [navigation]="navigationData()">
              </op-vertical-navigation>
          </aside>

          <!-- Page Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="max-w-4xl mx-auto">
              <router-outlet/>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout implements OnInit {
  private _navigationService = inject(NavigationService);
  private _navigationDataService = inject(NavigationDataService);

  // Get navigation data from global service
  navigationData = this._navigationDataService.navigationData;

  ngOnInit(): void {
    // Store navigation data in NavigationService for compatibility with existing components
    this._navigationService.storeNavigation(this._navigationDataService.navigationData());
  }
}
