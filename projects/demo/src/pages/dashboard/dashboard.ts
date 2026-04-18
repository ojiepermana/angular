import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutService } from '@ojiepermana/angular/layout';

@Component({
  selector: 'app-shell',
  imports: [],
  host: {
    class: 'flex h-full min-h-0 flex-col bg-background text-foreground',
  },
  template: `
    @if (layoutMode() === 'vertical') {
      <header class="flex h-12 shrink-0 items-center border-b border-border bg-card px-4">Header Vertical</header>
      <main class="min-h-0 flex-1 overflow-auto">
        <section class="flex min-h-full flex-col" data-dashboard-layout="vertical">
          @for (item of verticalItems; track item) {
            <div>Dashboard content vertical</div>
          }
        </section>
      </main>
      <footer class="flex h-12 shrink-0 items-center border-t border-border bg-card px-4">Footer</footer>
    } @else {
      <header class="flex shrink-0 items-center p-6 justify-between">
        <div>
          <h1 class="text-lg font-semibold tracking-tight">Header Horizontal</h1>
          <div class="text-sm text-muted-foreground -mt-1.5">Subtitle Horizontal</div>
        </div>
        <div>Action</div>
      </header>
      <main class="min-h-0 flex-1 overflow-auto">
        <section class="flex min-h-full flex-col p-6" data-dashboard-layout="horizontal">
          @for (item of verticalItems; track item) {
            <div>Dashboard content horizontal <br /></div>
          }
        </section>
      </main>
      <footer class="flex h-12 shrink-0 items-center border-t border-border px-6">Footer</footer>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly layoutMode = inject(LayoutService).mode;
  protected readonly verticalItems = Array.from({ length: 200 }, (_, index) => index);
}
