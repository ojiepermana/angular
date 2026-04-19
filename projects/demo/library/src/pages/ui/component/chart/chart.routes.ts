import type { Routes } from '@angular/router';

export const chartRoutes: Routes = [
  { path: '', redirectTo: 'bar', pathMatch: 'full' },
  {
    path: 'bar',
    title: 'Bar Charts',
    loadComponent: () => import('./bar/bar.page').then((m) => m.BarChartPageComponent),
  },
  {
    path: 'line',
    title: 'Line Charts',
    loadComponent: () => import('./line/line.page').then((m) => m.LineChartPageComponent),
  },
  {
    path: 'area',
    title: 'Area Charts',
    loadComponent: () => import('./area/area.page').then((m) => m.AreaChartPageComponent),
  },
  {
    path: 'pie',
    title: 'Pie Charts',
    loadComponent: () => import('./pie/pie.page').then((m) => m.PieChartPageComponent),
  },
  {
    path: 'radar',
    title: 'Radar Charts',
    loadComponent: () => import('./radar/radar.page').then((m) => m.RadarChartPageComponent),
  },
  {
    path: 'radial',
    title: 'Radial Charts',
    loadComponent: () => import('./radial/radial.page').then((m) => m.RadialChartPageComponent),
  },
  {
    path: 'scatter',
    title: 'Scatter Charts',
    loadComponent: () => import('./scatter/scatter.page').then((m) => m.ScatterChartPageComponent),
  },
  {
    path: 'tooltip',
    title: 'Tooltip Charts',
    loadComponent: () => import('./tooltip/tooltip.page').then((m) => m.TooltipChartPageComponent),
  },
];
