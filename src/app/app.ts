import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app',
  imports: [RouterOutlet],
  template: `
  <router-outlet />
  <!-- <div class="flex h-screen bg-background text-foreground transition-theme">
   <div class="flex h-full w-full">
      <router-outlet />
   </div>
  </div> -->

  `,
  styles: []
})
export class AppComponent {
  protected readonly title = signal('Ala Design System - Angular Kit');
}
