import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutService, LayoutType } from '../services/layout.service';

@Component({
  selector: 'layout-demo',
  imports: [JsonPipe, TitleCasePipe, RouterLink],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Layout Demo</h2>
        <nav class="flex gap-2">
          <a routerLink="/demo" class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80">
            Demo Home
          </a>
          <a routerLink="/demo/themes" class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80">
            Themes Demo
          </a>
        </nav>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">Current Layout: {{ layoutService.currentLayout() }}</h3>
          <p class="text-slate-600 dark:text-slate-400">
            Layout Config: {{ layoutService.layoutConfig() | json }}
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Switch Layout:</h3>
          <div class="flex gap-2">
            @for (layout of availableLayouts; track layout) {
              <button
                (click)="setLayout(layout)"
                [class]="getButtonClass(layout)"
                class="px-4 py-2 rounded-md font-medium transition-colors">
                {{ layout | titlecase }}
              </button>
            }
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Layout Properties:</h3>
          <ul class="space-y-1 text-sm">
            <li>Show Header: {{ layoutService.showHeader() }}</li>
            <li>Show Sidebar: {{ layoutService.showSidebar() }}</li>
            <li>Show Footer: {{ layoutService.showFooter() }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutDemoComponent {
  readonly layoutService = inject(LayoutService);
  readonly availableLayouts = this.layoutService.getAvailableLayouts();

  setLayout(layoutType: LayoutType): void {
    this.layoutService.setLayout(layoutType);
  }

  getButtonClass(layout: LayoutType): string {
    const isActive = this.layoutService.currentLayout() === layout;
    const baseClass = 'px-4 py-2 rounded-md font-medium transition-colors';

    if (isActive) {
      return `${baseClass} bg-blue-600 text-white`;
    }

    return `${baseClass} bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600`;
  }
}
