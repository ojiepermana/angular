import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutService, ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'app-dashboard',
  imports: [ShellLayoutComponent],
  host: {
    class: 'block h-full min-h-0',
  },
  template: `
    <ui-shell>
      <div ui-shell-header class="contents">
        @if (layoutMode() === 'vertical') {
          Header Vertical
        } @else {
          <div>
            <h1 class="text-lg font-semibold tracking-tight">Header Horizontal</h1>
            <div class="-mt-1.5 text-sm text-muted-foreground">Subtitle Horizontal</div>
          </div>
          <div>Action</div>
        }
      </div>

      <div ui-shell-main class="contents" [attr.data-dashboard-layout]="layoutMode()">
        @if (layoutMode() === 'vertical') {
          @for (item of verticalItems; track item) {
            <div>Dashboard content vertical</div>
          }
        } @else {
          @for (item of verticalItems; track item) {
            <div>Dashboard content horizontal <br /></div>
          }
        }
      </div>

      <div ui-shell-footer class="contents">Footer</div>
    </ui-shell>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly layoutMode = inject(LayoutService).mode;
  protected readonly verticalItems = Array.from({ length: 200 }, (_, index) => index);
}
