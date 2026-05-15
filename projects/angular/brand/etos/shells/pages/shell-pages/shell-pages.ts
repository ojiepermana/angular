import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'shell-pages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full min-h-0',
  },
  template: `
    <div class="flex h-full flex-col overflow-hidden">
      <header class="flex h-12 min-w-0 shrink-0 items-center gap-2 border-b border-border px-2">
        <ng-content select="[shell-pages-header]" />
      </header>

      <main class="min-h-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary/10">
        <ng-content select="[shell-pages-main]" />
      </main>

      <footer class="flex h-12 min-w-0 shrink-0 items-center gap-2 border-t border-border px-2">
        <ng-content select="[shell-pages-footer]" />
      </footer>
    </div>
  `,
  styles: `
    footer:empty {
      display: none;
    }
  `,
})
export class ShellPagesComponent {}
