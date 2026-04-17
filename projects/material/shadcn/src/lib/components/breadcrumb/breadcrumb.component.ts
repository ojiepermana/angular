import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-breadcrumb, nav[ui-breadcrumb]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-label]': '"breadcrumb"',
  },
  template: `<ng-content />`,
})
export class BreadcrumbComponent {}

@Component({
  selector: 'ol[ui-breadcrumb-list]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class BreadcrumbListComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      this.class(),
    ),
  );
}

@Component({
  selector: 'li[ui-breadcrumb-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class BreadcrumbItemComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('inline-flex items-center gap-1.5', this.class()));
}

@Component({
  selector: 'a[ui-breadcrumb-link]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class BreadcrumbLinkComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('transition-colors hover:text-foreground', this.class()),
  );
}

@Component({
  selector: 'span[ui-breadcrumb-page]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    role: 'link',
    'aria-disabled': 'true',
    'aria-current': 'page',
  },
  template: `<ng-content />`,
})
export class BreadcrumbPageComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('font-normal text-foreground', this.class()));
}

@Component({
  selector: 'li[ui-breadcrumb-separator]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    role: 'presentation',
    'aria-hidden': 'true',
  },
  template: `
    <ng-content>
      <svg
        class="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </ng-content>
  `,
})
export class BreadcrumbSeparatorComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('[&>svg]:size-3.5', this.class()));
}

@Component({
  selector: 'span[ui-breadcrumb-ellipsis]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    role: 'presentation',
    'aria-hidden': 'true',
  },
  template: `
    <svg
      class="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span class="sr-only">More</span>
  `,
})
export class BreadcrumbEllipsisComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex h-9 w-9 items-center justify-center', this.class()),
  );
}
