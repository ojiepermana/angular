import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerticalMiniDockLayout } from '../components/shared/vertical-mini-dock';

@Component({
  selector: 'layout-default',
  imports: [RouterOutlet, VerticalMiniDockLayout],
  template: `
    <div class="flex h-screen">
      <vertical-mini-dock-layout></vertical-mini-dock-layout>
      <!-- Main Content Area -->
      <div id="content" class="flex flex-1 flex-col overflow-hidden">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {}
