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

const DASHBOARD_PANEL_CLASSES = 'demo-dashboard-panel-shell';
const DASHBOARD_SURFACE_CLASSES = 'demo-dashboard-surface-shell';
const DASHBOARD_EYEBROW_CLASSES =
  'demo-dashboard-eyebrow text-[0.72rem] font-semibold uppercase tracking-[0.28em]';
const DASHBOARD_HERO_TITLE_CLASSES = 'demo-dashboard-hero-title';
const DASHBOARD_SECTION_TITLE_BASE_CLASSES = 'demo-dashboard-section-title';
const DASHBOARD_SECTION_TITLE_ROLE_CLASSES: Readonly<Record<DashboardSchemeRole, string>> = {
  primary: 'demo-dashboard-section-title--primary',
  secondary: 'demo-dashboard-section-title--secondary',
  tertiary: 'demo-dashboard-section-title--tertiary',
};
const DASHBOARD_LARGE_VALUE_CLASSES = 'demo-dashboard-large-value';
const DASHBOARD_DATA_LIST_CLASSES = 'demo-dashboard-data-list';
const DASHBOARD_DATA_ROW_CLASSES = 'demo-dashboard-data-row';
const DASHBOARD_TOGGLE_BUTTON_CLASSES =
  'focus-ring demo-dashboard-toggle-button min-h-11 px-4 py-2 text-sm font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-180 hover:-translate-y-px';
const DASHBOARD_TOGGLE_BUTTON_ACTIVE_CLASSES = `${DASHBOARD_TOGGLE_BUTTON_CLASSES} demo-dashboard-toggle-button--active`;
const DASHBOARD_METRIC_CARD_CLASSES = 'demo-dashboard-metric-card';
const DASHBOARD_POSITIVE_DELTA_CLASSES = 'demo-dashboard-delta-positive';
const DASHBOARD_NEGATIVE_DELTA_CLASSES = 'demo-dashboard-delta-negative';
const DASHBOARD_PROGRESS_TRACK_CLASSES = 'demo-dashboard-progress-track';
const DASHBOARD_PROGRESS_FILL_CLASSES = 'demo-dashboard-progress-fill';

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
    () =>
      `${DASHBOARD_SECTION_TITLE_BASE_CLASSES} ${DASHBOARD_SECTION_TITLE_ROLE_CLASSES[this.dashboardSectionTitle()]}`,
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
    <p class="demo-dashboard-quiet-text text-[0.72rem] font-medium uppercase tracking-[0.22em]">
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
      <p class="demo-dashboard-subtle-text max-w-[22ch] text-right text-xs leading-5">
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
        [style.--demo-dashboard-fill-tone]="tone()"
      ></span>
    </div>
  `,
})
export class DashboardProgressBarComponent {
  readonly value = input.required<number>();
  readonly tone = input.required<string>();
}
