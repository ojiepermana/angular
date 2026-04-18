import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '@ojiepermana/angular/navigation';
import { ThemeService } from '@ojiepermana/angular/theme';

import { DemoNavigationData } from './navigation.data';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  host: { class: 'block h-dvh' },
  template: `<router-outlet />`,
})
export class App {
  private readonly nav = inject(NavigationService);
  private readonly theme = inject(ThemeService);

  constructor() {
    void this.theme.snapshot();
    this.nav.registerItems(DemoNavigationData);
    effect(() => {
      // no-op; keeps ChangeDetection aware of nav state updates.
      this.nav.activeUrl();
    });
  }
}
