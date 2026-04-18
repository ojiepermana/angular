import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'demo-page-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full',
  },
  template: `
    <section class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
      <header class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="min-w-0 flex-1 space-y-3">
          <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{{ title() }}</h1>
          @if (description()) {
            <p class="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {{ description() }}
            </p>
          }
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2">
          <ng-content select="[demo-page-actions]" />
        </div>
      </header>

      <div class="flex flex-col gap-8">
        <ng-content />
      </div>
    </section>
  `,
})
export class PageShellComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
