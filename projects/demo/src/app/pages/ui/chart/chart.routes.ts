import type { Routes } from '@angular/router';

export const chartRoutes: Routes = [
  { path: '', loadComponent: () => import('./chart.page').then((m) => m.ChartPageComponent) },
];
