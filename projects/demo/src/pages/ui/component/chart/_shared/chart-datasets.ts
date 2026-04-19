import type { ChartConfig } from '@ojiepermana/angular/chart';

export const DEFAULT_TREND = 'Trending up by 5.2% this month';
export const DEFAULT_META = 'Showing total visitors for the last 6 months';
export const INTERACTIVE_META = 'Showing total visitors for the last 3 months';

export const VISITOR_CONFIG: ChartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
};

export const MONTHLY_VISITOR_DATA = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
] as const;

export const SINGLE_VISITOR_CONFIG: ChartConfig = {
  visitors: { label: 'Visitors', color: 'hsl(var(--chart-1))' },
};

export const SINGLE_VISITOR_DATA = [
  { month: 'Jan', visitors: 186, fill: 'hsl(var(--chart-1))', dotTone: 'hsl(var(--chart-1))' },
  { month: 'Feb', visitors: 305, fill: 'hsl(var(--chart-2))', dotTone: 'hsl(var(--chart-2))' },
  { month: 'Mar', visitors: 237, fill: 'hsl(var(--chart-3))', dotTone: 'hsl(var(--chart-3))' },
  { month: 'Apr', visitors: 73, fill: 'hsl(var(--chart-4))', dotTone: 'hsl(var(--chart-4))' },
  { month: 'May', visitors: 209, fill: 'hsl(var(--chart-5))', dotTone: 'hsl(var(--chart-5))' },
  { month: 'Jun', visitors: 214, fill: 'hsl(var(--chart-1))', dotTone: 'hsl(var(--chart-1))' },
] as const;

export const INTERACTIVE_VISITOR_DATA = [
  { date: 'Apr 03', desktop: 132, mobile: 94 },
  { date: 'Apr 12', desktop: 148, mobile: 102 },
  { date: 'Apr 22', desktop: 156, mobile: 111 },
  { date: 'May 02', desktop: 172, mobile: 126 },
  { date: 'May 11', desktop: 181, mobile: 132 },
  { date: 'May 21', desktop: 198, mobile: 145 },
  { date: 'May 31', desktop: 208, mobile: 153 },
  { date: 'Jun 09', desktop: 214, mobile: 158 },
  { date: 'Jun 19', desktop: 226, mobile: 166 },
  { date: 'Jun 30', desktop: 238, mobile: 172 },
] as const;

export const BROWSER_CONFIG: ChartConfig = {
  chrome: { label: 'Chrome', color: 'hsl(var(--chart-1))' },
  safari: { label: 'Safari', color: 'hsl(var(--chart-2))' },
  firefox: { label: 'Firefox', color: 'hsl(var(--chart-3))' },
  edge: { label: 'Edge', color: 'hsl(var(--chart-4))' },
  other: { label: 'Other', color: 'hsl(var(--chart-5))' },
};

export const BROWSER_DATA = [
  { browser: 'chrome', visitors: 275 },
  { browser: 'safari', visitors: 200 },
  { browser: 'firefox', visitors: 187 },
  { browser: 'edge', visitors: 173 },
  { browser: 'other', visitors: 90 },
] as const;

export const NEGATIVE_BAR_DATA = [
  { month: 'Jan', visitors: 108 },
  { month: 'Feb', visitors: -42 },
  { month: 'Mar', visitors: 76 },
  { month: 'Apr', visitors: -18 },
  { month: 'May', visitors: 124 },
  { month: 'Jun', visitors: -56 },
] as const;

export const RADIAL_PROGRESS_CONFIG: ChartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
  growth: { label: 'Growth', color: 'hsl(var(--chart-3))' },
  support: { label: 'Support', color: 'hsl(var(--chart-5))' },
};

export const RADIAL_SINGLE_DATA = [{ stream: 'desktop', value: 126, total: 200 }] as const;

export const RADIAL_STACKED_DATA = [
  { stream: 'desktop', value: 1260 },
  { stream: 'mobile', value: 570 },
] as const;

export const RADIAL_MULTI_DATA = [
  { stream: 'desktop', value: 126 },
  { stream: 'mobile', value: 94 },
  { stream: 'growth', value: 142 },
  { stream: 'support', value: 88 },
] as const;

export const RADAR_MONTH_DATA = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
] as const;

export const SCATTER_CONFIG: ChartConfig = {
  core: { label: 'Core', color: 'hsl(var(--chart-1))' },
  growth: { label: 'Growth', color: 'hsl(var(--chart-2))' },
  labs: { label: 'Labs', color: 'hsl(var(--chart-5))' },
};

export const SCATTER_DATA = [
  { x: 12, y: 26, revenue: 18, cluster: 'core' },
  { x: 18, y: 42, revenue: 24, cluster: 'core' },
  { x: 26, y: 54, revenue: 38, cluster: 'growth' },
  { x: 34, y: 72, revenue: 46, cluster: 'growth' },
  { x: 42, y: 68, revenue: 52, cluster: 'growth' },
  { x: 48, y: 36, revenue: 28, cluster: 'labs' },
  { x: 56, y: 58, revenue: 42, cluster: 'labs' },
  { x: 64, y: 82, revenue: 58, cluster: 'labs' },
] as const;

export const SCATTER_BASIC_CONFIG: ChartConfig = {
  sample: { label: 'Sample', color: 'hsl(var(--chart-1))' },
};

export const SCATTER_BASIC_DATA = [
  { x: 8, y: 18 },
  { x: 12, y: 31 },
  { x: 20, y: 22 },
  { x: 24, y: 46 },
  { x: 32, y: 28 },
  { x: 40, y: 62 },
  { x: 46, y: 54 },
  { x: 54, y: 71 },
] as const;

export const BROWSER_TOTAL_VISITORS = BROWSER_DATA.reduce((sum, item) => sum + item.visitors, 0);

/** Single-datum radial datasets modeled after shadcn's Text/Shape variants. */
export const RADIAL_TEXT_DATA = [{ browser: 'safari', visitors: 200 }] as const;
export const RADIAL_TEXT_MAX = 400;
export const RADIAL_SHAPE_DATA = [{ browser: 'safari', visitors: 1260 }] as const;
export const RADIAL_SHAPE_MAX = 1400;

export const INTERACTIVE_DESKTOP_TOTAL = INTERACTIVE_VISITOR_DATA.reduce((sum, item) => sum + item.desktop, 0);
export const INTERACTIVE_MOBILE_TOTAL = INTERACTIVE_VISITOR_DATA.reduce((sum, item) => sum + item.mobile, 0);

export const RADIAL_STACKED_TOTAL = RADIAL_STACKED_DATA.reduce((sum, item) => sum + item.value, 0);

/** Dataset shared by the Tooltip gallery — Mon-Sat running/swimming kcal. */
export const EXERCISE_CONFIG: ChartConfig = {
  running: { label: 'Running', color: 'hsl(var(--chart-1))' },
  swimming: { label: 'Swimming', color: 'hsl(var(--chart-2))' },
};

export const EXERCISE_DATA = [
  { day: 'Mon', date: '2024-07-15', running: 450, swimming: 300 },
  { day: 'Tue', date: '2024-07-16', running: 380, swimming: 420 },
  { day: 'Wed', date: '2024-07-17', running: 520, swimming: 120 },
  { day: 'Thu', date: '2024-07-18', running: 140, swimming: 550 },
  { day: 'Fri', date: '2024-07-19', running: 600, swimming: 350 },
  { day: 'Sat', date: '2024-07-20', running: 480, swimming: 400 },
] as const;

/** Optional "Activities" umbrella label consumed by the Custom Label tooltip variant. */
export const EXERCISE_CONFIG_WITH_UMBRELLA: ChartConfig = {
  activities: { label: 'Activities' },
  running: { label: 'Running', color: 'hsl(var(--chart-1))' },
  swimming: { label: 'Swimming', color: 'hsl(var(--chart-2))' },
};
