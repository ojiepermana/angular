import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@ojiepermana/material/shadcn';

/**
 * Demo-only toolbar — switch between `/v` (Vertical) and `/h` (Horizontal)
 * shell while preserving the rest of the URL.
 */
@Component({
  selector: 'demo-layout-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent],
  host: { class: 'inline-flex items-center gap-1' },
  template: `
    <a
      ui-button
      variant="ghost"
      size="sm"
      [routerLink]="verticalHref()"
      [attr.aria-pressed]="isVertical()"
      [class.bg-accent]="isVertical()"
      [class.text-accent-foreground]="isVertical()">
      Vertical
    </a>
    <a
      ui-button
      variant="ghost"
      size="sm"
      [routerLink]="horizontalHref()"
      [attr.aria-pressed]="!isVertical()"
      [class.bg-accent]="!isVertical()"
      [class.text-accent-foreground]="!isVertical()">
      Horizontal
    </a>
  `,
})
export class LayoutSwitcherComponent {
  private readonly router = inject(Router);

  private readonly url = toSignal(this.router.events.pipe(), { initialValue: null });

  protected readonly isVertical = computed(() => {
    // Recompute on every router event
    this.url();
    return this.router.url.startsWith('/v');
  });

  private readonly tail = computed(() => {
    this.url();
    const url = this.router.url;
    if (url.startsWith('/v')) return url.slice(2) || '/';
    if (url.startsWith('/h')) return url.slice(2) || '/';
    return url;
  });

  protected readonly verticalHref = computed(() => '/v' + this.tail());
  protected readonly horizontalHref = computed(() => '/h' + this.tail());
}
