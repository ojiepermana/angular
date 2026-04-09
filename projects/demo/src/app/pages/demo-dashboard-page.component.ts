import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-demo-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-full px-5 py-6 sm:px-8 sm:py-8">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header class="grid gap-4 rounded-4xl border border-border p-6 lg:grid-cols-[1.4fr,0.8fr]">
          <div class="space-y-4">
            <p class="text-[0.72rem] uppercase tracking-[0.32em] text-foreground/50">
              Layout Audit Demo
            </p>
            <div class="space-y-3">
              <h1 class="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Two legacy shells, now exposed as reusable layout primitives.
              </h1>
              <p class="max-w-2xl text-sm leading-6 text-foreground/70 sm:text-base">
                The route content stays unchanged while the surrounding shell swaps between vertical
                and horizontal composition. That is the contract a layout library should provide.
              </p>
            </div>
          </div>

          <div class="grid gap-3 rounded-3xl border border-border p-4">
            @for (metric of metrics; track metric.label) {
              <div
                class="flex items-end justify-between gap-3 rounded-[1.25rem] border border-border px-4 py-3"
              >
                <div>
                  <p class="text-xs uppercase tracking-[0.22em] text-foreground/50">
                    {{ metric.label }}
                  </p>
                  <p class="mt-2 text-2xl font-semibold">{{ metric.value }}</p>
                </div>
                <p class="text-xs text-foreground/60">{{ metric.caption }}</p>
              </div>
            }
          </div>
        </header>

        <div class="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <article class="rounded-4xl border border-border p-6">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/50">
                  Audit Summary
                </p>
                <h2 class="mt-2 text-xl font-semibold">
                  What changed to make the layouts reusable
                </h2>
              </div>
            </div>

            <div class="mt-6 grid gap-3">
              @for (item of improvements; track item.title) {
                <div class="rounded-3xl border border-border px-4 py-4">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h3 class="text-base font-semibold">{{ item.title }}</h3>
                      <p class="mt-1 text-sm leading-6 text-foreground/70">
                        {{ item.description }}
                      </p>
                    </div>
                    <span
                      class="rounded-full border border-border px-2 py-1 text-xs text-foreground/60"
                    >
                      {{ item.tag }}
                    </span>
                  </div>
                </div>
              }
            </div>
          </article>

          <aside class="grid gap-6">
            <section class="rounded-4xl border border-border p-6">
              <p class="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/50">
                Consumption Pattern
              </p>
              <ol class="mt-4 grid gap-3 text-sm leading-6 text-foreground/75">
                @for (step of steps; track step.title) {
                  <li class="rounded-3xl border border-border px-4 py-4">
                    <p class="font-medium text-foreground">{{ step.title }}</p>
                    <p class="mt-1">{{ step.description }}</p>
                  </li>
                }
              </ol>
            </section>

            <section class="rounded-4xl border border-border p-6">
              <p class="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/50">
                Verification
              </p>
              <div class="mt-4 grid gap-3">
                @for (check of checks; track check.label) {
                  <div
                    class="flex items-start justify-between gap-4 rounded-3xl border border-border px-4 py-3"
                  >
                    <div>
                      <p class="font-medium">{{ check.label }}</p>
                      <p class="mt-1 text-sm text-foreground/65">{{ check.detail }}</p>
                    </div>
                    <span class="text-sm font-medium">{{ check.value }}</span>
                  </div>
                }
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  `,
})
export class DemoDashboardPageComponent {
  protected readonly metrics = [
    { label: 'Selectors', value: '2', caption: 'prefixed and backward-compatible' },
    { label: 'Shells', value: '2', caption: 'demo wrappers using content projection' },
    {
      label: 'Exports',
      value: 'scoped',
      caption: 'available from the layouts secondary entry point',
    },
  ];

  protected readonly improvements = [
    {
      title: 'Generic shell defaults',
      description:
        'Removed app-specific branding from the horizontal header and replaced it with neutral fallback content.',
      tag: 'API',
    },
    {
      title: 'Container-aware composition',
      description:
        'Both layouts now honor the layout container width variable so full and boxed modes affect the shell itself.',
      tag: 'Layout',
    },
    {
      title: 'Library-aligned naming',
      description:
        'Selectors and exported symbols now follow the library component conventions while preserving the legacy selectors.',
      tag: 'DX',
    },
    {
      title: 'Secondary entry point rule',
      description:
        'Layout shells are consumed from a dedicated layouts entry point instead of the root package to keep the public API explicit.',
      tag: 'Packaging',
    },
  ];

  protected readonly steps = [
    {
      title: 'Wrap the layout in a shell component.',
      description:
        'Project your sidebar or header UI into the named slots instead of using the raw layout component as a page.',
    },
    {
      title: 'Nest page routes under the shell route.',
      description:
        'The child route renders through the internal router outlet, so the shell stays stable while page content changes.',
    },
    {
      title: 'Import the shared styles and provider once.',
      description:
        'The theme provider sets the DOM attributes and the library stylesheet supplies the design tokens and layout variables.',
    },
  ];

  protected readonly checks = [
    {
      label: 'Projection slots',
      value: 'Ready',
      detail: 'navigation, headerBrand, headerNavigation, header, headerActions',
    },
    {
      label: 'Theme controls',
      value: 'Ready',
      detail: 'scheme, appearance, color, and container switches are mounted in the demo',
    },
    {
      label: 'Build target',
      value: 'Pending',
      detail: 'validated after the library and demo builds complete',
    },
  ];
}
