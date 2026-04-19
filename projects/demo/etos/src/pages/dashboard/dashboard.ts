import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LayoutService } from '@ojiepermana/angular/layout';

@Component({
  selector: 'app-dashboard',
  host: {
    class: 'flex h-full min-h-0 flex-col bg-background text-foreground',
    '[attr.data-layout-mode]': 'layoutMode()',
  },
  template: `
    <header [class]="headerClasses()">
      @if (layoutMode() === 'vertical') {
        Header Vertical
      } @else {
        <div>
          <h1 class="text-lg font-semibold tracking-tight">Header Horizontal</h1>
          <div class="-mt-1.5 text-sm text-muted-foreground">Subtitle Horizontal</div>
        </div>
        <div>Action</div>
      }
    </header>

    <main class="min-h-0 flex-1 overflow-auto">
      <section [class]="contentClasses()" [attr.data-dashboard-layout]="layoutMode()">
        @if (layoutMode() === 'vertical') {
          @for (item of verticalItems; track item) {
            <div>Dashboard content vertical</div>
          }
        } @else {
          @for (item of verticalItems; track item) {
            <div>Dashboard content horizontal <br /></div>
          }
        }
      </section>
    </main>

    <footer [class]="footerClasses()">Footer</footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly layoutMode = inject(LayoutService).mode;
  protected readonly headerClasses = computed(() =>
    this.layoutMode() === 'vertical'
      ? 'flex h-12 shrink-0 items-center border-b border-border bg-card px-4'
      : 'flex shrink-0 items-center justify-between p-6',
  );
  protected readonly contentClasses = computed(() =>
    this.layoutMode() === 'vertical' ? 'flex min-h-full flex-col' : 'flex min-h-full flex-col p-6',
  );
  protected readonly footerClasses = computed(() =>
    this.layoutMode() === 'vertical'
      ? 'flex h-12 shrink-0 items-center border-t border-border bg-card px-4'
      : 'flex h-12 shrink-0 items-center border-t border-border px-6',
  );
  protected readonly verticalItems = Array.from({ length: 200 }, (_, index) => index);
}
