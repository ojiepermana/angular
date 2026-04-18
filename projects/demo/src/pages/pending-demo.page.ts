import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pending-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  host: {
    class: 'block h-full',
  },
  template: `
    <section class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8 lg:px-10">
      <header class="flex flex-col gap-3">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{{ sectionLabel() }}</p>
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{{ featureTitle() }}</h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Route ini sudah aktif supaya navigasi demo tetap valid, tetapi halaman showcase untuk fitur ini belum
            dibuat.
          </p>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <article class="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div class="flex flex-col gap-4">
            <div
              class="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Coming soon
            </div>
            <div class="space-y-3">
              <h2 class="text-lg font-semibold tracking-tight text-card-foreground">
                {{ sectionLabel() }} / {{ featureTitle() }}
              </h2>
              <p class="text-sm leading-6 text-muted-foreground">
                Anda sudah bisa menautkan URL ini dari navigation registry tanpa memicu router error. Nanti tinggal
                ganti route ini dengan halaman demo final saat implementasi komponennya siap.
              </p>
            </div>
          </div>
        </article>

        <aside class="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <div class="flex flex-col gap-4">
            <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Available demos</h2>
            <div class="flex flex-col gap-3">
              <a
                routerLink="/ui/shadcn/button"
                class="rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Open shadcn Button demo
              </a>
              <a
                routerLink="/ui/chart/bar"
                class="rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Open Bar Chart demo
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class PendingDemoPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private readonly paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly sectionLabel = computed(() => {
    const section = this.routeData()['sectionLabel'];
    return typeof section === 'string' ? section : 'Demo';
  });

  protected readonly featureTitle = computed(() => this.toTitleCase(this.paramMap().get('feature') ?? 'Overview'));

  private toTitleCase(value: string): string {
    return value
      .split('-')
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
