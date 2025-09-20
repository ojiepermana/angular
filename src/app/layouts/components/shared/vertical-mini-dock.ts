import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DarkModeToggle } from './dark-mode-toggle.component';

@Component({
  selector: 'vertical-mini-dock-layout',
  imports: [DarkModeToggle],
  template: `
     <!-- Sidebar -->
      <div id="minibar" class=" h-full flex flex-col p-2 items-center w-16 border-r">
        <!-- Top Section -->
        <div class="flex flex-col items-center space-y-2">
          <!-- Dark Mode Toggle with default settings -->
          <dark-mode-toggle iconStyle="default" borderStyle="rounded"></dark-mode-toggle>
        </div>

        <!-- Spacer -->
        <div class="flex-1"></div>

        <!-- Bottom Section -->
        <div class="flex flex-col items-center space-y-2">
          <!-- You can add more controls here like settings, user menu, etc. -->
        </div>
      </div>
  `,
  styles: `
    #minibar {
      transition: all 0.2s ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalMiniDockLayout {

}
