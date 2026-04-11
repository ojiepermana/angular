import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  computed,
  input,
  output,
} from '@angular/core';

type DashboardSchemeRole = 'primary' | 'secondary' | 'tertiary';

export interface DashboardToggleOption {
  readonly id: string;
  readonly label: string;
}

export interface DashboardMetricCardData {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly note: string;
  readonly positive: boolean;
}

const DASHBOARD_PANEL_CLASSES = `appearance-shell relative overflow-hidden rounded-(--sales-panel-radius) border border-(--appearance-border) bg-[linear-gradient(180deg,color-mix(in_oklch,var(--appearance-surface)_97%,var(--sales-blue)_3%)_0%,color-mix(in_oklch,var(--appearance-surface)_99%,transparent)_100%)] shadow-[0_26px_64px_-56px_color-mix(in_srgb,var(--sales-blue)_28%,transparent)] after:pointer-events-none after:absolute after:inset-0 after:rounded-(--sales-panel-radius) after:shadow-[inset_0_1px_0_color-mix(in_srgb,white_38%,transparent)] after:content-['']`;
const DASHBOARD_SURFACE_CLASSES =
  'appearance-shell rounded-(--sales-surface-radius) border border-(--appearance-border) bg-[color-mix(in_oklch,var(--appearance-surface)_98%,var(--sales-blue)_2%)] shadow-none';
const DASHBOARD_EYEBROW_CLASSES =
  'text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--mat-sys-on-background)_55%,transparent)]';
const DASHBOARD_HERO_TITLE_CLASSES =
  'text-[color-mix(in_oklch,var(--mat-sys-primary)_84%,var(--mat-sys-on-background))]';
const DASHBOARD_SECTION_TITLE_ROLE_CLASSES: Readonly<Record<DashboardSchemeRole, string>> = {
  primary: 'text-[color-mix(in_oklch,var(--mat-sys-primary)_72%,var(--mat-sys-on-background))]',
  secondary: 'text-[color-mix(in_oklch,var(--mat-sys-secondary)_78%,var(--mat-sys-on-background))]',
  tertiary: 'text-[color-mix(in_oklch,var(--mat-sys-tertiary)_82%,var(--mat-sys-on-background))]',
};
const DASHBOARD_LARGE_VALUE_CLASSES =
  'text-[color-mix(in_oklch,var(--sales-blue)_78%,var(--mat-sys-on-background))]';
const DASHBOARD_DATA_LIST_CLASSES = 'list-none p-0 [&>li+li]:border-t [&>li+li]:border-border';
const DASHBOARD_DATA_ROW_CLASSES = 'py-[0.95rem]';
const DASHBOARD_TOGGLE_BUTTON_CLASSES =
  'focus-ring min-h-11 rounded-(--sales-control-radius) border border-(--appearance-border) bg-[color-mix(in_oklch,var(--appearance-surface)_98%,var(--sales-blue)_2%)] px-4 py-2 text-sm font-medium text-foreground transition-[transform,background-color,border-color,color,box-shadow] duration-180 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--sales-blue)_28%,transparent)] hover:shadow-[0_12px_26px_-24px_color-mix(in_srgb,var(--sales-blue)_32%,transparent)]';
const DASHBOARD_TOGGLE_BUTTON_ACTIVE_CLASSES = `${DASHBOARD_TOGGLE_BUTTON_CLASSES} border-transparent bg-foreground text-background shadow-[0_16px_30px_-26px_color-mix(in_srgb,var(--mat-sys-on-background)_44%,transparent)]`;
const DASHBOARD_METRIC_CARD_CLASSES =
  'block border-border border-t px-[1.2rem] py-[1.1rem] first:border-t-0 md:nth-[-n+2]:border-t-0 md:nth-[2n]:border-l xl:not-first:border-l xl:border-t-0';
const DASHBOARD_POSITIVE_DELTA_CLASSES =
  'text-[color-mix(in_srgb,var(--sales-emerald)_82%,var(--mat-sys-on-background))]';
const DASHBOARD_NEGATIVE_DELTA_CLASSES =
  'text-[color-mix(in_srgb,var(--mat-sys-error)_82%,var(--mat-sys-on-background))]';
const DASHBOARD_PROGRESS_TRACK_CLASSES =
  'block mt-3 h-[0.55rem] overflow-hidden rounded-full bg-[color-mix(in_oklch,var(--mat-sys-background)_93%,var(--sales-blue)_7%)]';
const DASHBOARD_PROGRESS_FILL_CLASSES = 'block h-full rounded-full bg-(--fill-tone)';

@Directive({
  selector: '[dashboardPanel]',
  host: {
    class: DASHBOARD_PANEL_CLASSES,
  },
})
export class DashboardPanelDirective {}

@Directive({
  selector: '[dashboardSurface]',
  host: {
    class: DASHBOARD_SURFACE_CLASSES,
  },
})
export class DashboardSurfaceDirective {}

@Directive({
  selector: '[dashboardEyebrow]',
  host: {
    class: DASHBOARD_EYEBROW_CLASSES,
  },
})
export class DashboardEyebrowDirective {}

@Directive({
  selector: '[dashboardHeroTitle]',
  host: {
    class: DASHBOARD_HERO_TITLE_CLASSES,
  },
})
export class DashboardHeroTitleDirective {}

@Directive({
  selector: '[dashboardSectionTitle]',
  host: {
    '[class]': 'titleClass()',
  },
})
export class DashboardSectionTitleDirective {
  readonly dashboardSectionTitle = input<DashboardSchemeRole>('primary');

  protected readonly titleClass = computed(
    () => DASHBOARD_SECTION_TITLE_ROLE_CLASSES[this.dashboardSectionTitle()],
  );
}

@Directive({
  selector: '[dashboardLargeValue]',
  host: {
    class: DASHBOARD_LARGE_VALUE_CLASSES,
  },
})
export class DashboardLargeValueDirective {}

@Directive({
  selector: 'ul[dashboardDataList]',
  host: {
    class: DASHBOARD_DATA_LIST_CLASSES,
  },
})
export class DashboardDataListDirective {}

@Directive({
  selector: 'li[dashboardDataRow]',
  host: {
    class: DASHBOARD_DATA_ROW_CLASSES,
  },
})
export class DashboardDataRowDirective {}

@Component({
  selector: 'app-dashboard-toggle-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <p dashboardEyebrow>{{ label() }}</p>

    <div class="mt-2 flex flex-wrap gap-2" role="group" [attr.aria-label]="groupLabel()">
      @for (option of options(); track option.id) {
        <button
          type="button"
          [class]="selectedId() === option.id ? activeButtonClasses : buttonClasses"
          [attr.aria-pressed]="selectedId() === option.id"
          (click)="selectionChange.emit(option.id)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  imports: [DashboardEyebrowDirective],
})
export class DashboardToggleGroupComponent {
  readonly label = input.required<string>();
  readonly groupLabel = input.required<string>();
  readonly options = input.required<readonly DashboardToggleOption[]>();
  readonly selectedId = input.required<string>();
  readonly selectionChange = output<string>();

  protected readonly buttonClasses = DASHBOARD_TOGGLE_BUTTON_CLASSES;
  protected readonly activeButtonClasses = DASHBOARD_TOGGLE_BUTTON_ACTIVE_CLASSES;
}

@Component({
  selector: 'app-dashboard-metric-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: DASHBOARD_METRIC_CARD_CLASSES,
    role: 'article',
  },
  template: `
    <p
      class="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--mat-sys-on-background)_54%,transparent)]"
    >
      {{ metric().label }}
    </p>
    <p dashboardLargeValue class="mt-3 tabular-nums text-[1.9rem] font-semibold tracking-[-0.04em]">
      {{ metric().value }}
    </p>
    <div class="mt-4 flex items-end justify-between gap-3">
      <p
        class="text-sm font-semibold"
        [class]="metric().positive ? positiveDeltaClasses : negativeDeltaClasses"
      >
        {{ metric().delta }}
      </p>
      <p
        class="max-w-[22ch] text-right text-xs leading-5 text-[color-mix(in_srgb,var(--mat-sys-on-background)_66%,transparent)]"
      >
        {{ metric().note }}
      </p>
    </div>
  `,
  imports: [DashboardLargeValueDirective],
})
export class DashboardMetricCardComponent {
  readonly metric = input.required<DashboardMetricCardData>();

  protected readonly positiveDeltaClasses = DASHBOARD_POSITIVE_DELTA_CLASSES;
  protected readonly negativeDeltaClasses = DASHBOARD_NEGATIVE_DELTA_CLASSES;
}

@Component({
  selector: 'app-dashboard-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <div class="${DASHBOARD_PROGRESS_TRACK_CLASSES}">
      <span
        class="${DASHBOARD_PROGRESS_FILL_CLASSES}"
        [style.width.%]="value()"
        [style.--fill-tone]="tone()"
      ></span>
    </div>
  `,
})
export class DashboardProgressBarComponent {
  readonly value = input.required<number>();
  readonly tone = input.required<string>();
}
