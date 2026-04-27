import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'etos-app-shell',
  host: {
    class: 'flex h-full min-h-0 flex-col',
  },
  template: `
    <header class="flex h-12 shrink-0 items-center border-b border-border bg-card px-4">
      <ng-content select="[etos-app-shell-header]" />
    </header>
    <main class="min-h-0 flex-1 overflow-auto">
      <ng-content select="[etos-app-shell-main]" />
    </main>
    <footer class="flex h-12 shrink-0 items-center border-t border-border bg-card px-4">
      <ng-content select="[etos-app-shell-footer]" />
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EtosAppShellComponent {}
