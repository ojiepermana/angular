import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  DashboardDataListDirective,
  DashboardDataRowDirective,
  DashboardEyebrowDirective,
  DashboardHeroTitleDirective,
  DashboardLargeValueDirective,
  DashboardMetricCardComponent,
  DashboardPanelDirective,
  DashboardProgressBarComponent,
  DashboardSectionTitleDirective,
  DashboardSurfaceDirective,
  DashboardToggleGroupComponent,
} from './dashboard-primitives';

type TimeframeKey = 'month' | 'quarter' | 'ytd';
type RegionKey = 'global' | 'americas' | 'emea' | 'apac';

interface TimeframeOption {
  readonly id: TimeframeKey;
  readonly label: string;
  readonly rangeLabel: string;
}

interface RegionOption {
  readonly id: RegionKey;
  readonly label: string;
}

interface MetricCard {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly note: string;
  readonly positive: boolean;
}

interface SignalCard {
  readonly label: string;
  readonly value: string;
  readonly note: string;
  readonly tone: string;
}

interface TrendDatum {
  readonly label: string;
  readonly revenue: number;
  readonly target: number;
}

interface ChannelDatum {
  readonly label: string;
  readonly share: number;
  readonly shareLabel: string;
  readonly amount: string;
  readonly momentum: string;
  readonly tone: string;
}

interface FunnelDatum {
  readonly label: string;
  readonly deals: string;
  readonly value: string;
  readonly velocity: string;
  readonly progress: number;
  readonly tone: string;
}

interface BoardDatum {
  readonly label: string;
  readonly attainment: number;
  readonly attainmentLabel: string;
  readonly revenue: string;
  readonly delta: string;
  readonly tone: string;
}

interface DealDatum {
  readonly account: string;
  readonly stage: string;
  readonly owner: string;
  readonly value: string;
  readonly window: string;
  readonly confidence: number;
}

interface SalesSnapshot {
  readonly rangeLabel: string;
  readonly regionLabel: string;
  readonly summary: string;
  readonly focus: string;
  readonly focusDetail: string;
  readonly metrics: readonly MetricCard[];
  readonly signals: readonly SignalCard[];
  readonly trend: readonly TrendDatum[];
  readonly channels: readonly ChannelDatum[];
  readonly funnel: readonly FunnelDatum[];
  readonly board: readonly BoardDatum[];
  readonly deals: readonly DealDatum[];
}

interface TimeframeBase {
  readonly revenue: number;
  readonly orders: number;
  readonly avgDeal: number;
  readonly winRate: number;
  readonly pipelineCoverage: number;
  readonly revenueDelta: number;
  readonly forecastConfidence: number;
  readonly newLogoRevenue: number;
  readonly renewalRate: number;
  readonly channelShares: readonly number[];
  readonly trendLabels: readonly string[];
  readonly trendRevenue: readonly number[];
  readonly trendTarget: readonly number[];
  readonly funnelDeals: readonly number[];
  readonly funnelValues: readonly number[];
}

interface RegionProfile {
  readonly label: string;
  readonly revenueFactor: number;
  readonly ordersFactor: number;
  readonly avgDealFactor: number;
  readonly winShift: number;
  readonly coverageShift: number;
  readonly targetFactor: number;
  readonly revenueDeltaShift: number;
  readonly forecastShift: number;
  readonly newLogoShift: number;
  readonly renewalShift: number;
  readonly channelShift: readonly number[];
  readonly trendShape: readonly number[];
  readonly focus: string;
  readonly focusDetail: string;
}

interface TeamPerformanceBase {
  readonly label: string;
  readonly attainment: number;
  readonly revenue: number;
  readonly delta: number;
  readonly tone: string;
}

interface DealBase {
  readonly account: string;
  readonly stage: string;
  readonly owner: string;
  readonly value: number;
  readonly window: string;
  readonly confidence: number;
}

interface TrendChartPoint {
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly valueLabel: string;
}

interface TrendChartModel {
  readonly revenuePath: string;
  readonly targetPath: string;
  readonly areaPath: string;
  readonly points: readonly TrendChartPoint[];
  readonly labels: readonly { x: number; label: string }[];
  readonly ticks: readonly { y: number; label: string }[];
}

const TIMEFRAME_OPTIONS: readonly TimeframeOption[] = [
  { id: 'month', label: 'Month', rangeLabel: 'Last 30 days' },
  { id: 'quarter', label: 'Quarter', rangeLabel: 'Current quarter' },
  { id: 'ytd', label: 'YTD', rangeLabel: 'Year to date' },
];

const REGION_OPTIONS: readonly RegionOption[] = [
  { id: 'global', label: 'Global' },
  { id: 'americas', label: 'Americas' },
  { id: 'emea', label: 'EMEA' },
  { id: 'apac', label: 'APAC' },
];

const CHANNEL_LABELS = ['Direct', 'Partner', 'Expansion', 'Self-serve'] as const;
const CHANNEL_TONES = [
  'var(--demo-dashboard-accent)',
  'var(--demo-dashboard-secondary)',
  'var(--demo-dashboard-success)',
  'var(--demo-dashboard-warning)',
] as const;

const FUNNEL_LABELS = ['Qualified', 'Proposal', 'Negotiation', 'Commit'] as const;
const FUNNEL_TONES = [
  'var(--demo-dashboard-accent)',
  'var(--demo-dashboard-support)',
  'var(--demo-dashboard-secondary)',
  'var(--demo-dashboard-success)',
] as const;

function isTimeframeKey(value: string): value is TimeframeKey {
  return value === 'month' || value === 'quarter' || value === 'ytd';
}

function isRegionKey(value: string): value is RegionKey {
  return value === 'global' || value === 'americas' || value === 'emea' || value === 'apac';
}

const BASE_TIMEFRAME_DATA: Readonly<Record<TimeframeKey, TimeframeBase>> = {
  month: {
    revenue: 1_840_000,
    orders: 46,
    avgDeal: 40_000,
    winRate: 32.4,
    pipelineCoverage: 3.4,
    revenueDelta: 7.2,
    forecastConfidence: 84,
    newLogoRevenue: 620_000,
    renewalRate: 92,
    channelShares: [37, 28, 21, 14],
    trendLabels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    trendRevenue: [970_000, 1_110_000, 1_060_000, 1_220_000, 1_390_000, 1_840_000],
    trendTarget: [1_020_000, 1_080_000, 1_120_000, 1_250_000, 1_420_000, 1_760_000],
    funnelDeals: [82, 37, 21, 13],
    funnelValues: [3_700_000, 2_680_000, 1_940_000, 1_280_000],
  },
  quarter: {
    revenue: 4_820_000,
    orders: 118,
    avgDeal: 40_850,
    winRate: 33.7,
    pipelineCoverage: 3.6,
    revenueDelta: 8.6,
    forecastConfidence: 87,
    newLogoRevenue: 1_680_000,
    renewalRate: 93,
    channelShares: [35, 30, 22, 13],
    trendLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    trendRevenue: [2_620_000, 3_180_000, 3_540_000, 4_060_000, 4_410_000, 4_820_000],
    trendTarget: [2_700_000, 3_050_000, 3_360_000, 3_880_000, 4_320_000, 4_640_000],
    funnelDeals: [194, 92, 48, 27],
    funnelValues: [9_600_000, 6_800_000, 4_240_000, 2_580_000],
  },
  ytd: {
    revenue: 15_420_000,
    orders: 356,
    avgDeal: 43_300,
    winRate: 35.1,
    pipelineCoverage: 3.9,
    revenueDelta: 11.2,
    forecastConfidence: 89,
    newLogoRevenue: 4_980_000,
    renewalRate: 95,
    channelShares: [33, 29, 24, 14],
    trendLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    trendRevenue: [8_200_000, 9_640_000, 11_180_000, 12_760_000, 14_040_000, 15_420_000],
    trendTarget: [7_900_000, 9_200_000, 10_740_000, 12_180_000, 13_480_000, 14_900_000],
    funnelDeals: [508, 212, 116, 70],
    funnelValues: [26_800_000, 18_700_000, 11_400_000, 7_100_000],
  },
};

const REGION_PROFILES: Readonly<Record<RegionKey, RegionProfile>> = {
  global: {
    label: 'Global overview',
    revenueFactor: 1,
    ordersFactor: 1,
    avgDealFactor: 1,
    winShift: 0,
    coverageShift: 0,
    targetFactor: 1,
    revenueDeltaShift: 0,
    forecastShift: 0,
    newLogoShift: 0,
    renewalShift: 0,
    channelShift: [0, 0, 0, 0],
    trendShape: [1, 1, 1, 1, 1, 1],
    focus:
      'Enterprise demand is healthy, but legal review is still the main drag on close timing in larger opportunities.',
    focusDetail:
      'Keep pricing, procurement, and security approvals inside the weekly operating review so large deals do not stall after proposal.',
  },
  americas: {
    label: 'Americas field performance',
    revenueFactor: 0.94,
    ordersFactor: 0.9,
    avgDealFactor: 1.06,
    winShift: 1.1,
    coverageShift: 0.2,
    targetFactor: 0.96,
    revenueDeltaShift: 1.8,
    forecastShift: 2,
    newLogoShift: 160_000,
    renewalShift: 1,
    channelShift: [4, -2, -1, -1],
    trendShape: [1.04, 1.08, 1.02, 0.98, 1.05, 1.11],
    focus:
      'Americas is landing larger expansion motions, but final signatures still bunch up behind legal and procurement review.',
    focusDetail:
      'Escalate multi-stakeholder approvals one stage earlier and keep partner desk support attached to renewal-plus-expansion deals.',
  },
  emea: {
    label: 'EMEA regional view',
    revenueFactor: 0.78,
    ordersFactor: 0.82,
    avgDealFactor: 0.98,
    winShift: -0.6,
    coverageShift: -0.1,
    targetFactor: 0.84,
    revenueDeltaShift: -1.2,
    forecastShift: -1,
    newLogoShift: -80_000,
    renewalShift: 0,
    channelShift: [-2, 3, 1, -2],
    trendShape: [0.92, 0.98, 1.04, 1.09, 1.02, 1.08],
    focus:
      'EMEA pipeline quality is improving after stricter qualification, but security review remains the pacing item for public-sector accounts.',
    focusDetail:
      'Shorten time-to-close by tightening next-step discipline and moving approval packages into proposal stage rather than negotiation.',
  },
  apac: {
    label: 'APAC growth engine',
    revenueFactor: 0.68,
    ordersFactor: 0.74,
    avgDealFactor: 1.04,
    winShift: 0.4,
    coverageShift: 0.1,
    targetFactor: 0.72,
    revenueDeltaShift: 2.6,
    forecastShift: 3,
    newLogoShift: 220_000,
    renewalShift: 2,
    channelShift: [-3, 1, 0, 2],
    trendShape: [0.88, 0.94, 1.06, 1.12, 1.16, 1.21],
    focus:
      'APAC remains the fastest-growing territory, led by distributor wins and stronger conversion from qualified pipeline.',
    focusDetail:
      'Lean into partner-led expansion while coaching direct teams on procurement timing for larger enterprise accounts.',
  },
};

const REGION_TEAM_BOARD: Readonly<Record<RegionKey, readonly TeamPerformanceBase[]>> = {
  global: [
    {
      label: 'Enterprise',
      attainment: 118,
      revenue: 2_420_000,
      delta: 16,
      tone: 'var(--demo-dashboard-accent)',
    },
    {
      label: 'Mid-market',
      attainment: 104,
      revenue: 1_460_000,
      delta: 9,
      tone: 'var(--demo-dashboard-secondary)',
    },
    {
      label: 'Expansion',
      attainment: 112,
      revenue: 1_180_000,
      delta: 13,
      tone: 'var(--demo-dashboard-success)',
    },
    {
      label: 'Partner',
      attainment: 97,
      revenue: 880_000,
      delta: 6,
      tone: 'var(--demo-dashboard-warning)',
    },
  ],
  americas: [
    {
      label: 'West Coast',
      attainment: 121,
      revenue: 1_180_000,
      delta: 18,
      tone: 'var(--demo-dashboard-accent)',
    },
    {
      label: 'Central',
      attainment: 101,
      revenue: 840_000,
      delta: 8,
      tone: 'var(--demo-dashboard-secondary)',
    },
    {
      label: 'East Coast',
      attainment: 109,
      revenue: 960_000,
      delta: 11,
      tone: 'var(--demo-dashboard-success)',
    },
    {
      label: 'LATAM',
      attainment: 92,
      revenue: 410_000,
      delta: 7,
      tone: 'var(--demo-dashboard-warning)',
    },
  ],
  emea: [
    {
      label: 'UKI',
      attainment: 106,
      revenue: 760_000,
      delta: 10,
      tone: 'var(--demo-dashboard-accent)',
    },
    {
      label: 'DACH',
      attainment: 98,
      revenue: 690_000,
      delta: 6,
      tone: 'var(--demo-dashboard-secondary)',
    },
    {
      label: 'France & Benelux',
      attainment: 94,
      revenue: 520_000,
      delta: 5,
      tone: 'var(--demo-dashboard-success)',
    },
    {
      label: 'Middle East',
      attainment: 88,
      revenue: 360_000,
      delta: 4,
      tone: 'var(--demo-dashboard-warning)',
    },
  ],
  apac: [
    {
      label: 'ANZ',
      attainment: 116,
      revenue: 640_000,
      delta: 19,
      tone: 'var(--demo-dashboard-accent)',
    },
    {
      label: 'Singapore',
      attainment: 108,
      revenue: 520_000,
      delta: 15,
      tone: 'var(--demo-dashboard-secondary)',
    },
    {
      label: 'Japan',
      attainment: 97,
      revenue: 480_000,
      delta: 9,
      tone: 'var(--demo-dashboard-success)',
    },
    {
      label: 'India',
      attainment: 111,
      revenue: 450_000,
      delta: 21,
      tone: 'var(--demo-dashboard-warning)',
    },
  ],
};

const REGION_DEALS: Readonly<Record<RegionKey, readonly DealBase[]>> = {
  global: [
    {
      account: 'Northstar Retail Group',
      stage: 'Negotiation',
      owner: 'A. Cole',
      value: 240_000,
      window: 'Apr 28',
      confidence: 78,
    },
    {
      account: 'Verve Logistics',
      stage: 'Proposal',
      owner: 'I. Rahman',
      value: 190_000,
      window: 'May 03',
      confidence: 62,
    },
    {
      account: 'Brightline Health',
      stage: 'Commit',
      owner: 'N. Dwi',
      value: 360_000,
      window: 'Apr 24',
      confidence: 86,
    },
    {
      account: 'Argon Manufacturing',
      stage: 'Discovery',
      owner: 'L. Sato',
      value: 128_000,
      window: 'May 16',
      confidence: 41,
    },
  ],
  americas: [
    {
      account: 'Sierra Commerce',
      stage: 'Negotiation',
      owner: 'A. Cole',
      value: 310_000,
      window: 'Apr 26',
      confidence: 82,
    },
    {
      account: 'Monroe Health',
      stage: 'Commit',
      owner: 'J. Patel',
      value: 270_000,
      window: 'Apr 23',
      confidence: 88,
    },
    {
      account: 'Luma Freight',
      stage: 'Proposal',
      owner: 'E. Stone',
      value: 175_000,
      window: 'May 08',
      confidence: 66,
    },
    {
      account: 'Atlas Hospitality',
      stage: 'Discovery',
      owner: 'R. Quinn',
      value: 142_000,
      window: 'May 18',
      confidence: 48,
    },
  ],
  emea: [
    {
      account: 'Nordmark Energy',
      stage: 'Proposal',
      owner: 'H. Weber',
      value: 210_000,
      window: 'May 02',
      confidence: 64,
    },
    {
      account: 'Kite Finance',
      stage: 'Negotiation',
      owner: 'S. Martin',
      value: 188_000,
      window: 'Apr 29',
      confidence: 72,
    },
    {
      account: 'Orchid Public Sector',
      stage: 'Discovery',
      owner: 'P. Musa',
      value: 154_000,
      window: 'May 21',
      confidence: 39,
    },
    {
      account: 'Elm Biotech',
      stage: 'Commit',
      owner: 'T. Ahmed',
      value: 260_000,
      window: 'Apr 25',
      confidence: 79,
    },
  ],
  apac: [
    {
      account: 'Halo Distribution',
      stage: 'Commit',
      owner: 'M. Tan',
      value: 220_000,
      window: 'Apr 24',
      confidence: 84,
    },
    {
      account: 'Summit Telecom',
      stage: 'Negotiation',
      owner: 'K. Prasetyo',
      value: 198_000,
      window: 'Apr 30',
      confidence: 74,
    },
    {
      account: 'Pacific Retail',
      stage: 'Proposal',
      owner: 'R. Lim',
      value: 164_000,
      window: 'May 06',
      confidence: 61,
    },
    {
      account: 'Kawa Systems',
      stage: 'Discovery',
      owner: 'Y. Watanabe',
      value: 138_000,
      window: 'May 17',
      confidence: 43,
    },
  ],
};

const CURRENCY_COMPACT_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const CURRENCY_WHOLE_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const INTEGER_FORMAT = new Intl.NumberFormat('en-US');

function formatCompactCurrency(value: number): string {
  return CURRENCY_COMPACT_FORMAT.format(value);
}

function formatWholeCurrency(value: number): string {
  return CURRENCY_WHOLE_FORMAT.format(value);
}

function formatInteger(value: number): string {
  return INTEGER_FORMAT.format(Math.round(value));
}

function formatSignedPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
}

function formatSignedDelta(value: number, suffix: string): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded}${suffix}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeShares(values: readonly number[]): number[] {
  const safeValues = values.map((value) => Math.max(value, 6));
  const total = safeValues.reduce((sum, value) => sum + value, 0);
  return safeValues.map((value) => (value / total) * 100);
}

function buildTrendPath(points: readonly TrendChartPoint[]): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function createTrendChartModel(data: readonly TrendDatum[]): TrendChartModel {
  const width = 720;
  const height = 280;
  const left = 30;
  const right = 20;
  const top = 18;
  const bottom = 36;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;
  const maxValue = Math.max(...data.flatMap((point) => [point.revenue, point.target]));
  const chartMax = Math.ceil((maxValue * 1.12) / 50_000) * 50_000;
  const stepX = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;
  const bottomY = height - bottom;
  const mapY = (value: number) => bottomY - (value / chartMax) * innerHeight;

  const revenuePoints = data.map((point, index) => ({
    x: left + stepX * index,
    y: mapY(point.revenue),
    label: point.label,
    valueLabel: formatCompactCurrency(point.revenue),
  }));

  const targetPoints = data.map((point, index) => ({
    x: left + stepX * index,
    y: mapY(point.target),
    label: point.label,
    valueLabel: formatCompactCurrency(point.target),
  }));

  const labels = revenuePoints.map((point) => ({ x: point.x, label: point.label }));

  const ticks = Array.from({ length: 4 }, (_, index) => {
    const value = chartMax - (chartMax / 3) * index;
    return {
      y: mapY(value),
      label: formatCompactCurrency(value),
    };
  });

  const firstPoint = revenuePoints[0];
  const lastPoint = revenuePoints[revenuePoints.length - 1];
  const areaPath = [
    `M ${firstPoint.x} ${bottomY}`,
    ...revenuePoints.map((point) => `L ${point.x} ${point.y}`),
    `L ${lastPoint.x} ${bottomY}`,
    'Z',
  ].join(' ');

  return {
    revenuePath: buildTrendPath(revenuePoints),
    targetPath: buildTrendPath(targetPoints),
    areaPath,
    points: revenuePoints,
    labels,
    ticks,
  };
}

function createSalesSnapshot(timeframe: TimeframeKey, region: RegionKey): SalesSnapshot {
  const base = BASE_TIMEFRAME_DATA[timeframe];
  const profile = REGION_PROFILES[region];
  const timeframeScale = base.revenue / BASE_TIMEFRAME_DATA.quarter.revenue;

  const revenue = Math.round(base.revenue * profile.revenueFactor);
  const orders = Math.round(base.orders * profile.ordersFactor);
  const avgDeal = Math.round(base.avgDeal * profile.avgDealFactor);
  const winRate = Math.round((base.winRate + profile.winShift) * 10) / 10;
  const pipelineCoverage = Math.round((base.pipelineCoverage + profile.coverageShift) * 10) / 10;
  const revenueDelta = Math.round((base.revenueDelta + profile.revenueDeltaShift) * 10) / 10;
  const forecastConfidence = clamp(base.forecastConfidence + profile.forecastShift, 72, 99);
  const newLogoRevenue = Math.round(
    base.newLogoRevenue * profile.revenueFactor + profile.newLogoShift,
  );
  const renewalRate = clamp(base.renewalRate + profile.renewalShift, 84, 99);

  const channelShares = normalizeShares(
    base.channelShares.map((value, index) => value + profile.channelShift[index]),
  );

  const trend = base.trendLabels.map((label, index) => ({
    label,
    revenue: Math.round(
      base.trendRevenue[index] * profile.revenueFactor * profile.trendShape[index],
    ),
    target: Math.round(base.trendTarget[index] * profile.targetFactor),
  }));

  const channels = channelShares.map((share, index) => ({
    label: CHANNEL_LABELS[index],
    share,
    shareLabel: `${Math.round(share)}%`,
    amount: formatCompactCurrency((revenue * share) / 100),
    momentum: `${share > base.channelShares[index] ? '+' : ''}${Math.round((share - base.channelShares[index]) * 10) / 10} pts`,
    tone: CHANNEL_TONES[index],
  }));

  const boardShift = timeframe === 'month' ? -4 : timeframe === 'ytd' ? 3 : 0;
  const board = REGION_TEAM_BOARD[region].map((item) => {
    const attainment = clamp(Math.round(item.attainment + boardShift + profile.winShift), 78, 138);
    return {
      label: item.label,
      attainment,
      attainmentLabel: `${attainment}%`,
      revenue: formatCompactCurrency(item.revenue * timeframeScale),
      delta: formatSignedPercent(item.delta + profile.revenueDeltaShift / 2),
      tone: item.tone,
    };
  });

  const scaledFunnelValues = base.funnelValues.map((value) => value * profile.revenueFactor);
  const maxFunnelValue = Math.max(...scaledFunnelValues);
  const funnel = FUNNEL_LABELS.map((label, index) => ({
    label,
    deals: formatInteger(base.funnelDeals[index] * profile.ordersFactor),
    value: formatCompactCurrency(scaledFunnelValues[index]),
    velocity: `${(4.2 + index * 2 + (region === 'emea' ? 0.8 : 0)).toFixed(1)}d avg`,
    progress: (scaledFunnelValues[index] / maxFunnelValue) * 100,
    tone: FUNNEL_TONES[index],
  }));

  const deals = REGION_DEALS[region].map((item) => ({
    account: item.account,
    stage: item.stage,
    owner: item.owner,
    value: formatWholeCurrency(item.value * timeframeScale),
    window: item.window,
    confidence: clamp(
      item.confidence + (timeframe === 'month' ? -2 : timeframe === 'ytd' ? 3 : 0),
      32,
      94,
    ),
  }));

  const metrics: readonly MetricCard[] = [
    {
      label: 'Net revenue',
      value: formatCompactCurrency(revenue),
      delta: formatSignedPercent(revenueDelta),
      note: `${TIMEFRAME_OPTIONS.find((option) => option.id === timeframe)?.rangeLabel ?? ''} vs prior period`,
      positive: revenueDelta >= 0,
    },
    {
      label: 'Orders closed',
      value: formatInteger(orders),
      delta: formatSignedPercent(profile.ordersFactor * 100 - 100 + base.revenueDelta / 3),
      note: `Average deal ${formatWholeCurrency(avgDeal)}`,
      positive: true,
    },
    {
      label: 'Win rate',
      value: `${winRate}%`,
      delta: formatSignedDelta(winRate - 31, ' pts'),
      note: 'Measured on qualified opportunities',
      positive: winRate >= 31,
    },
    {
      label: 'Pipeline cover',
      value: `${pipelineCoverage}x`,
      delta: formatSignedDelta(pipelineCoverage - 3.2, 'x'),
      note: 'Committed plus best-case against plan',
      positive: pipelineCoverage >= 3.2,
    },
  ];

  const signals: readonly SignalCard[] = [
    {
      label: 'Forecast confidence',
      value: `${forecastConfidence}%`,
      note: 'Manager inspection and stage hygiene improved this week.',
      tone: 'var(--demo-dashboard-accent)',
    },
    {
      label: 'New logo revenue',
      value: formatCompactCurrency(newLogoRevenue),
      note: 'Fresh business contribution across greenfield accounts.',
      tone: 'var(--demo-dashboard-success)',
    },
    {
      label: 'Renewal health',
      value: `${renewalRate}%`,
      note: 'Early renewal plays are protecting margin and expansion capacity.',
      tone: 'var(--demo-dashboard-warning)',
    },
  ];

  return {
    rangeLabel: TIMEFRAME_OPTIONS.find((option) => option.id === timeframe)?.rangeLabel ?? '',
    regionLabel: profile.label,
    summary: `${profile.label} is pacing ${formatSignedPercent(revenueDelta)} versus the prior period with ${pipelineCoverage}x pipeline cover and ${formatWholeCurrency(avgDeal)} average deal size.`,
    focus: profile.focus,
    focusDetail: profile.focusDetail,
    metrics,
    signals,
    trend,
    channels,
    funnel,
    board,
    deals,
  };
}

@Component({
  selector: 'app-demo-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardDataListDirective,
    DashboardDataRowDirective,
    DashboardEyebrowDirective,
    DashboardHeroTitleDirective,
    DashboardLargeValueDirective,
    DashboardMetricCardComponent,
    DashboardPanelDirective,
    DashboardProgressBarComponent,
    DashboardSectionTitleDirective,
    DashboardSurfaceDirective,
    DashboardToggleGroupComponent,
  ],
  host: {
    class: 'block',
  },
  template: `
    @let current = snapshot();
    @let chart = trendChart();

    <section class="demo-dashboard-theme min-h-full px-5 py-6 sm:px-8 sm:py-8">
      <div class="mx-auto flex w-full flex-col gap-5">
        <header
          dashboardPanel
          class="grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:px-6 lg:py-6"
        >
          <div class="flex flex-col gap-5">
            <div class="flex flex-wrap items-center gap-3">
              <span
                class="demo-dashboard-live-badge inline-flex items-center gap-[0.55rem] px-[0.8rem] py-[0.45rem] text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
              >
                Live forecast sync
              </span>
              <span class="demo-dashboard-meta-text text-xs font-medium uppercase tracking-[0.2em]">
                {{ current.rangeLabel }}
              </span>
            </div>

            <div class="max-w-[64ch]">
              <p dashboardEyebrow>Sales Command Center</p>
              <h1
                dashboardHeroTitle
                class="mt-3 max-w-[16ch] text-[2.1rem] font-semibold leading-[1.03] tracking-[-0.04em] sm:text-[2.8rem]"
              >
                Revenue health without the dashboard noise.
              </h1>
              <p class="demo-dashboard-body-text mt-4 max-w-[58ch] text-[0.98rem] leading-7">
                {{ current.summary }}
              </p>
            </div>
          </div>

          <div class="grid gap-4 lg:justify-items-end">
            <div class="flex w-full flex-col gap-4 lg:max-w-[24rem]">
              <app-dashboard-toggle-group
                label="Timeframe"
                groupLabel="Timeframe"
                [options]="timeframeOptions"
                [selectedId]="selectedTimeframe()"
                (selectionChange)="selectTimeframe($event)"
              />

              <app-dashboard-toggle-group
                label="Territory"
                groupLabel="Region filter"
                [options]="regionOptions"
                [selectedId]="selectedRegion()"
                (selectionChange)="selectRegion($event)"
              />
            </div>

            <section dashboardSurface class="w-full px-4 py-4 lg:max-w-[24rem]">
              <p dashboardEyebrow>This Week</p>
              <h2 dashboardSectionTitle="secondary" class="mt-2 text-lg font-semibold leading-7">
                {{ current.focus }}
              </h2>
              <p class="demo-dashboard-supporting-text mt-2 text-sm leading-6">
                {{ current.focusDetail }}
              </p>
            </section>
          </div>
        </header>

        <section dashboardPanel class="px-4 py-4 sm:px-5 sm:py-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p dashboardEyebrow>Executive Summary</p>
              <h2 dashboardSectionTitle="primary" class="mt-2 text-xl font-semibold tracking-tight">
                Quarter pacing and operating signals
              </h2>
            </div>
            <p class="demo-dashboard-muted-text max-w-[48ch] text-sm leading-6">
              The headline numbers stay in one shared strip so the top of the page reads faster and
              feels less fragmented.
            </p>
          </div>

          <div dashboardSurface class="mt-5 grid overflow-hidden md:grid-cols-2 xl:grid-cols-4">
            @for (metric of current.metrics; track metric.label) {
              <app-dashboard-metric-card [metric]="metric" />
            }
          </div>
        </section>

        <div class="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.72fr)]">
          <section dashboardPanel class="px-5 py-5">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p dashboardEyebrow>Revenue Cadence</p>
                <h2
                  dashboardSectionTitle="primary"
                  class="mt-2 text-xl font-semibold tracking-tight"
                >
                  Closed-won revenue versus target trajectory
                </h2>
              </div>
              <div
                class="demo-dashboard-meta-text flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.18em]"
              >
                <span class="inline-flex items-center gap-2">
                  <span class="size-2 rounded-full bg-(--demo-dashboard-accent)"></span>
                  Closed won
                </span>
                <span class="inline-flex items-center gap-2">
                  <span
                    class="demo-dashboard-chart-target-key h-px w-6 border-t border-dashed"
                  ></span>
                  Target
                </span>
              </div>
            </div>

            <div
              dashboardSurface
              class="demo-dashboard-chart-surface mt-5 overflow-hidden p-4 sm:p-5"
            >
              <svg
                viewBox="0 0 720 280"
                class="h-auto w-full"
                aria-label="Closed-won revenue chart"
              >
                @for (tick of chart.ticks; track tick.label) {
                  <g>
                    <line
                      class="demo-dashboard-chart-grid [stroke-dasharray:4_10]"
                      x1="30"
                      [attr.y1]="tick.y"
                      x2="700"
                      [attr.y2]="tick.y"
                    />
                    <text
                      class="demo-dashboard-chart-label text-[11px] tracking-[0.02em]"
                      x="0"
                      [attr.y]="tick.y + 4"
                    >
                      {{ tick.label }}
                    </text>
                  </g>
                }

                <path class="demo-dashboard-chart-area" [attr.d]="chart.areaPath" />
                <path
                  class="demo-dashboard-chart-target fill-none [stroke-dasharray:8_8] [stroke-linecap:round] stroke-2"
                  [attr.d]="chart.targetPath"
                />
                <path
                  class="demo-dashboard-chart-line fill-none [stroke-linecap:round] [stroke-linejoin:round] stroke-3"
                  [attr.d]="chart.revenuePath"
                />

                @for (point of chart.points; track point.label) {
                  <g>
                    <circle
                      class="demo-dashboard-chart-point stroke-2"
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="5"
                    />
                    <text
                      class="demo-dashboard-chart-label text-[11px] tracking-[0.02em]"
                      [attr.x]="point.x - 16"
                      [attr.y]="point.y - 12"
                    >
                      {{ point.valueLabel }}
                    </text>
                  </g>
                }

                @for (label of chart.labels; track label.label) {
                  <text
                    class="demo-dashboard-chart-label text-[11px] tracking-[0.02em]"
                    [attr.x]="label.x - 14"
                    y="270"
                  >
                    {{ label.label }}
                  </text>
                }
              </svg>
            </div>
          </section>

          <aside dashboardPanel class="px-5 py-5">
            <div>
              <p dashboardEyebrow>Territory Brief</p>
              <h2
                dashboardSectionTitle="secondary"
                class="mt-2 text-xl font-semibold tracking-tight"
              >
                {{ current.regionLabel }}
              </h2>
              <p class="demo-dashboard-supporting-text mt-3 text-sm leading-6">
                Focus on the operating levers that are moving fastest inside the selected territory.
              </p>
            </div>

            <ul dashboardDataList class="mt-5">
              @for (signalCard of current.signals; track signalCard.label) {
                <li dashboardDataRow>
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p
                        class="demo-dashboard-quiet-text text-[0.72rem] font-medium uppercase tracking-[0.22em]"
                      >
                        {{ signalCard.label }}
                      </p>
                      <p class="demo-dashboard-supporting-text mt-2 text-sm leading-6">
                        {{ signalCard.note }}
                      </p>
                    </div>
                    <p
                      class="shrink-0 tabular-nums text-lg font-semibold tracking-[-0.03em]"
                      [style.color]="signalCard.tone"
                    >
                      {{ signalCard.value }}
                    </p>
                  </div>
                </li>
              }
            </ul>
          </aside>
        </div>

        <div class="grid gap-5 xl:grid-cols-2">
          <section dashboardPanel class="px-5 py-5">
            <div>
              <p dashboardEyebrow>Revenue Composition</p>
              <h2
                dashboardSectionTitle="secondary"
                class="mt-2 text-xl font-semibold tracking-tight"
              >
                Channel mix and funnel velocity
              </h2>
            </div>

            <div class="mt-5 pt-0">
              <div>
                <p class="text-sm font-semibold text-foreground">Channel mix</p>
                <p class="demo-dashboard-muted-text mt-1 text-sm">
                  Where closed revenue is landing right now.
                </p>
              </div>

              <div
                class="demo-dashboard-channel-track mt-4 flex gap-[0.35rem] rounded-full p-[0.35rem]"
              >
                @for (channel of current.channels; track channel.label) {
                  <span
                    class="block min-h-3 rounded-full bg-(--segment-tone)"
                    [style.width.%]="channel.share"
                    [style.--segment-tone]="channel.tone"
                    [attr.aria-label]="channel.label + ' ' + channel.shareLabel"
                  ></span>
                }
              </div>

              <ul dashboardDataList class="mt-4">
                @for (channel of current.channels; track channel.label) {
                  <li dashboardDataRow>
                    <div
                      class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4"
                    >
                      <div>
                        <p class="font-medium text-foreground">{{ channel.label }}</p>
                        <p class="demo-dashboard-subtle-text mt-1 text-sm">
                          {{ channel.amount }}
                        </p>
                      </div>
                      <p class="tabular-nums text-sm font-semibold text-foreground">
                        {{ channel.shareLabel }}
                      </p>
                      <p class="demo-dashboard-soft-text text-sm">
                        {{ channel.momentum }}
                      </p>
                    </div>
                  </li>
                }
              </ul>
            </div>

            <div class="mt-6 border-t border-border pt-6">
              <div>
                <p class="text-sm font-semibold text-foreground">Funnel velocity</p>
                <p class="demo-dashboard-muted-text mt-1 text-sm">
                  Compression and momentum by late-stage pipeline band.
                </p>
              </div>

              <ul dashboardDataList class="mt-4">
                @for (stage of current.funnel; track stage.label) {
                  <li dashboardDataRow>
                    <div
                      class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4"
                    >
                      <div>
                        <p class="font-medium text-foreground">{{ stage.label }}</p>
                        <p class="demo-dashboard-subtle-text mt-1 text-sm">
                          {{ stage.deals }} deals
                        </p>
                      </div>
                      <p class="tabular-nums text-sm font-semibold text-foreground">
                        {{ stage.value }}
                      </p>
                      <p class="demo-dashboard-soft-text text-sm">
                        {{ stage.velocity }}
                      </p>
                    </div>
                    <app-dashboard-progress [value]="stage.progress" [tone]="stage.tone" />
                  </li>
                }
              </ul>
            </div>
          </section>

          <section dashboardPanel class="px-5 py-5">
            <div>
              <p dashboardEyebrow>Execution Coverage</p>
              <h2
                dashboardSectionTitle="tertiary"
                class="mt-2 text-xl font-semibold tracking-tight"
              >
                Team attainment and active deals
              </h2>
            </div>

            <div class="mt-5 pt-0">
              <div>
                <p class="text-sm font-semibold text-foreground">Quota scorecard</p>
                <p class="demo-dashboard-muted-text mt-1 text-sm">
                  Contribution by team and attainment against target.
                </p>
              </div>

              <ul dashboardDataList class="mt-4">
                @for (rep of current.board; track rep.label) {
                  <li dashboardDataRow>
                    <div
                      class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4"
                    >
                      <div>
                        <p class="font-medium text-foreground">{{ rep.label }}</p>
                        <p class="demo-dashboard-subtle-text mt-1 text-sm">
                          {{ rep.revenue }}
                        </p>
                      </div>
                      <p class="tabular-nums text-sm font-semibold text-foreground">
                        {{ rep.attainmentLabel }}
                      </p>
                      <p class="demo-dashboard-soft-text text-sm">
                        {{ rep.delta }}
                      </p>
                    </div>
                    <app-dashboard-progress
                      [value]="rep.attainment > 100 ? 100 : rep.attainment"
                      [tone]="rep.tone"
                    />
                  </li>
                }
              </ul>
            </div>

            <div class="mt-6 border-t border-border pt-6">
              <div>
                <p class="text-sm font-semibold text-foreground">Active deals</p>
                <p class="demo-dashboard-muted-text mt-1 text-sm">
                  Large opportunities that still need executive attention.
                </p>
              </div>

              <ul dashboardDataList class="mt-4">
                @for (deal of current.deals; track deal.account) {
                  <li dashboardDataRow>
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                          <h3 class="truncate text-base font-semibold text-foreground">
                            {{ deal.account }}
                          </h3>
                          <span
                            class="demo-dashboard-stage-chip inline-flex items-center px-[0.55rem] py-[0.28rem] text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
                          >
                            {{ deal.stage }}
                          </span>
                        </div>
                        <p class="demo-dashboard-subtle-text mt-2 text-sm">
                          Owner {{ deal.owner }} · Expected {{ deal.window }}
                        </p>
                      </div>
                      <div class="shrink-0 text-left sm:text-right">
                        <p dashboardLargeValue class="tabular-nums text-base font-semibold">
                          {{ deal.value }}
                        </p>
                        <p class="demo-dashboard-soft-text mt-1 text-sm">
                          {{ deal.confidence }}% confidence
                        </p>
                      </div>
                    </div>
                    <app-dashboard-progress
                      [value]="deal.confidence"
                      tone="var(--demo-dashboard-accent)"
                    />
                  </li>
                }
              </ul>
            </div>
          </section>
        </div>
      </div>
    </section>
  `,
})
export class DemoDashboardPageComponent {
  protected readonly timeframeOptions = TIMEFRAME_OPTIONS;
  protected readonly regionOptions = REGION_OPTIONS;
  protected readonly selectedTimeframe = signal<TimeframeKey>('quarter');
  protected readonly selectedRegion = signal<RegionKey>('global');

  protected readonly snapshot = computed(() =>
    createSalesSnapshot(this.selectedTimeframe(), this.selectedRegion()),
  );

  protected readonly trendChart = computed(() => createTrendChartModel(this.snapshot().trend));

  protected selectTimeframe(timeframe: string): void {
    if (isTimeframeKey(timeframe)) {
      this.selectedTimeframe.set(timeframe);
    }
  }

  protected selectRegion(region: string): void {
    if (isRegionKey(region)) {
      this.selectedRegion.set(region);
    }
  }
}
