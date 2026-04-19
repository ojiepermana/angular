import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HorizontalLayoutComponent, LayoutService, VerticalLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'app-pages',
  imports: [RouterLink, HorizontalLayoutComponent, VerticalLayoutComponent],
  host: {
    class: 'contents',
  },
  template: `
    @switch (layoutMode()) {
      @case ('horizontal') {
        <horizontal>
          <a ui-layout-brand routerLink="/" class="flex items-center gap-3  px-2 py-1.5 transition-colors ">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-lg  text-[0.7rem] font-semibold tracking-[0.22em] bg-primary text-background">
              OJ
            </span>
            <span class="hidden flex-col gap-0.5 sm:flex">
              <span class="text-sm font-semibold leading-none tracking-tight">Ojiepermana UI</span>
              <span class="text-xs leading-none text-muted-foreground">Angular component library</span>
            </span>
          </a>

          <button
            ui-layout-profile
            type="button"
            aria-label="Open profile menu"
            class="flex items-center gap-3  px-2 py-1.5 text-sm shadow-sm transition-colors ">
            <span class="hidden text-sm font-medium text-muted-foreground sm:inline">Ojie Permana</span>
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background text-xs font-semibold ">
              OP
            </span>
          </button>
        </horizontal>
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
