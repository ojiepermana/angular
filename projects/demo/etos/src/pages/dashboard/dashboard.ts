import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  host: {
    class: 'block min-h-full',
  },
  template: `
    <section class="grid min-h-full  gap-6">
      <header class="flex flex-col gap-4  border border-border p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-lg font-semibold tracking-tight">Operations overview</h1>
          <p class="text-sm text-muted-foreground">A dashboard page rendered inside the Etos demo shell.</p>
        </div>
        <button
          type="button"
          class=" border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          Export summary
        </button>
      </header>

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,24rem)]">
        <article class="grid gap-4  border border-border p-5 shadow-sm">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted-foreground">Service health</p>
              <h2 class="text-3xl font-semibold tracking-tight">99.94%</h2>
            </div>
            <p class="text-sm text-muted-foreground">Stable across 12 regions in the last 30 minutes</p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            @for (metric of metrics; track metric.label) {
              <section class="rounded-lg border border-border/70 bg-background p-4">
                <p class="text-sm text-muted-foreground">{{ metric.label }}</p>
                <p class="mt-3 text-2xl font-semibold tracking-tight text-foreground">{{ metric.value }}</p>
                <p class="mt-1 text-sm text-muted-foreground">{{ metric.detail }}</p>
              </section>
            }
          </div>
        </article>

        <aside class="grid gap-4  border border-border p-5 shadow-sm">
          <div class="space-y-1">
            <h2 class="text-base font-semibold tracking-tight">Deployment queue</h2>
            <p class="text-sm text-muted-foreground">Everything that needs attention in the next window.</p>
          </div>

          <div class="grid gap-3">
            @for (deployment of deployments; track deployment.name) {
              <article class="rounded-lg border border-border/70 bg-background p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-sm font-semibold text-foreground">{{ deployment.name }}</h3>
                    <p class="text-sm text-muted-foreground">{{ deployment.owner }}</p>
                  </div>
                  <span class="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {{ deployment.status }}
                  </span>
                </div>
                <p class="mt-3 text-sm text-muted-foreground">{{ deployment.window }}</p>
              </article>
            }
          </div>
        </aside>
      </div>

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article class=" border border-border p-5 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-semibold tracking-tight">Traffic by channel</h2>
              <p class="text-sm text-muted-foreground">Main acquisition drivers for the current cycle.</p>
            </div>
            <span class="text-sm text-muted-foreground">Updated 2 min ago</span>
          </div>

          <div class="mt-5 grid gap-3">
            @for (channel of channels; track channel.name) {
              <div class="grid gap-2 rounded-lg border border-border/70 bg-background p-4">
                <div class="flex items-center justify-between gap-3 text-sm">
                  <span class="font-medium text-foreground">{{ channel.name }}</span>
                  <span class="text-muted-foreground">{{ channel.share }}</span>
                </div>
                <div class="h-2 rounded-full bg-muted">
                  <div class="h-full rounded-full bg-primary" [style.width]="channel.share"></div>
                </div>
              </div>
            }
          </div>
        </article>

        <article class=" border border-border p-5 shadow-sm">
          <div class="space-y-1">
            <h2 class="text-base font-semibold tracking-tight">Recent events</h2>
            <p class="text-sm text-muted-foreground">A compact activity feed that keeps the right column busy.</p>
          </div>

          <div class="mt-5 grid gap-3">
            @for (event of events; track event.title) {
              <div class="rounded-lg border border-border/70 bg-background p-4">
                <div class="flex items-center justify-between gap-3">
                  <p class="text-sm font-medium text-foreground">{{ event.title }}</p>
                  <span class="text-xs text-muted-foreground">{{ event.time }}</span>
                </div>
                <p class="mt-2 text-sm text-muted-foreground">{{ event.detail }}</p>
              </div>
            }
          </div>
        </article>
      </div>

      <footer class="flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <span class="text-sm text-muted-foreground">Footer</span>
        <span class="text-xs text-muted-foreground">Rendered inside the restored Etos demo shell</span>
      </footer>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly metrics = [
    { label: 'Active sessions', value: '18.2k', detail: '+12% from last hour' },
    { label: 'Automation success', value: '97.8%', detail: '41 workflows completed' },
    { label: 'Escalations', value: '14', detail: '3 need review today' },
  ];

  protected readonly deployments = [
    { name: 'Gateway v4.2', owner: 'Platform squad', status: 'Ready', window: '08:30 - 09:00 UTC' },
    { name: 'Search indexing', owner: 'Growth squad', status: 'Paused', window: 'Awaiting content approval' },
    { name: 'Billing patch', owner: 'Revenue ops', status: 'Queued', window: '10:15 - 10:45 UTC' },
  ];

  protected readonly channels = [
    { name: 'Direct', share: '72%' },
    { name: 'Partner referrals', share: '48%' },
    { name: 'Lifecycle campaigns', share: '36%' },
  ];

  protected readonly events = [
    {
      title: 'Cache cluster rotated',
      detail: 'Background maintenance completed without dropped sessions.',
      time: '1m',
    },
    {
      title: 'New enterprise trial',
      detail: 'A 250-seat workspace was provisioned from the sales handoff.',
      time: '12m',
    },
    { title: 'Content sync delayed', detail: 'Editorial import is waiting on the upstream asset bundle.', time: '27m' },
  ];
}
