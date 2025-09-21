import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeToggle } from '../../layouts/components/shared/dark-mode-toggle.component';
import { VerticalNavigation } from '../../../../projects/kit/src/lib/components/navigation/vertical-navigation';
import { NavigationService } from '../../../../projects/kit/src/lib/services/navigation.service';
import { demoNavigationData } from './navigations';

@Component({
  selector: 'demo-page',
  imports: [RouterOutlet, DarkModeToggle, VerticalNavigation],
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
              <h1 class="text-lg font-semibold">Angular Kit</h1>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm">Right Menu</span>
              <dark-mode-toggle
                [iconStyle]="'default'"
                [borderStyle]="'rounded'"
              />
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Sidebar Navigation -->
          <aside class="flex-shrink-0 w-72 border-r overflow-y-auto">
            <!-- Alternative: Direct data binding -->
            <op-vertical-navigation [navigation]="navigationData">
            </op-vertical-navigation>
          </aside>

          <!-- Page Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <router-outlet/>
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

  ngOnInit(): void {
    // Store navigation data in service for global access
    this._navigationService.storeNavigation(demoNavigationData);
  }

  navigationData = demoNavigationData;
  isEcommerceExpanded = false;
  isAuthExpanded = false;

  toggleEcommerceExpanded(): void {
    this.isEcommerceExpanded = !this.isEcommerceExpanded;
  }

  toggleAuthExpanded(): void {
    this.isAuthExpanded = !this.isAuthExpanded;
  }
}
