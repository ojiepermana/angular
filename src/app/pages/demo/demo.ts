import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeToggle } from '../../layouts/components/shared/dark-mode-toggle.component';
import { VerticalNavigation } from '../../../../projects/kit/src/lib/components/navigation/vertical-navigation';
import { demoNavigationData } from '../../../../projects/kit/src/lib/components/navigation/demo-data';

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
            <h1 class="text-lg font-semibold">Angular Kit - Navigation Restored! 🎉</h1>
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
          <aside class="flex-shrink-0 w-64 border-r p-4 overflow-y-auto">
            <op-vertical-navigation
              [navigation]="navigationData">
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
export class DemoPage {
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
