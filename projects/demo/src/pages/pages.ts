import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HorizontalLayoutComponent, LayoutService, VerticalLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'app-pages',
  imports: [HorizontalLayoutComponent, VerticalLayoutComponent],
  host: {
    class: 'contents',
  },
  template: `
    @switch (layoutMode()) {
      @case ('horizontal') {
        <horizontal />
      }
      @default {
        <vertical />
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pages {
  protected readonly layoutMode = inject(LayoutService).mode;
}
