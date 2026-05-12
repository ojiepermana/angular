import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShellPagesComponent } from '@ojiepermana/angular/etos/shell/pages';

@Component({
  selector: 'etos-shell',
  imports: [ShellPagesComponent],
  host: {
    class: 'block h-full min-h-0',
  },
  template: `
    <shell-pages>
      <div shell-pages-header>
        <div class="flex min-w-0 flex-col leading-tight">
          <span>Header</span>
          <small class="-mt-1 text-xs text-muted-foreground">Small text as page descriptions</small>
        </div>
      </div>

      <div shell-pages-main class="p-2">Main</div>

      <div shell-pages-footer>Footer</div>
    </shell-pages>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellPage {}
