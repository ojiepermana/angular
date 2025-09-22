import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeToggle } from '../components/shared/dark-mode-toggle.component';
import { HorizontalNavigation } from '../../../../projects/kit/src/lib/components/navigation/horizontal/horizontal-navigation';
import { NavigationService } from '../../../../projects/kit/src/lib/services/navigation.service';
import { NavigationDataService } from '../../services';

@Component({
  selector: 'layout-modern',
  imports: [RouterOutlet, DarkModeToggle, HorizontalNavigation],
  template: `
    <div class="h-screen bg-background text-foreground p-16">
      <div class="flex flex-col h-full max-w-7xl mx-auto border border-border rounded-lg shadow-xs overflow-hidden relative">
        <!-- Navigation Header -->
        <header class="absolute top-0 left-0 right-0 z-10 px-4  glass-header border-b">
          <div class="flex items-center justify-between h-12">
            <div class="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L3 18L12 22L21 18L22 7L12 2Z" fill="#DD0031"/>
                <path d="M12 2V22L21 18L22 7L12 2Z" fill="#C3002F"/>
                <path d="M12 5.5L8.5 17H10.4L11.1 15H12.9L13.6 17H15.5L12 5.5Z" fill="white"/>
                <path d="M12 8.5L11.4 12H12.6L12 8.5Z" fill="white"/>
              </svg>
              <h1 class="text-sm font-semibold mr-8">Angular Kit</h1>
              <op-horizontal-navigation
                name="demo-horizontal"
                [navigation]="navigationData()">
              </op-horizontal-navigation>
            </div>

            <div class="flex items-center gap-4">
              <dark-mode-toggle
                [iconStyle]="'default'"
                [borderStyle]="'none'"
              />
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto p-4 min-h-0" style="padding-top: 5rem; padding-bottom: 4rem;">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer -->
        <footer class="absolute bottom-0 left-0 right-0 z-10 p-3 glass-footer text-center text-sm border-t">
          Built with ❤️ by Ojie Permana and AI
        </footer>
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

