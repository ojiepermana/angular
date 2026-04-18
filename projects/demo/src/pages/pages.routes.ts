import type { Route, Routes } from '@angular/router';

const pendingRoute = (segment: string, sectionLabel: string): Route => ({
  path: `ui/${segment}/:feature`,
  data: { sectionLabel },
  loadComponent: () => import('./pending-demo.page').then((m) => m.PendingDemoPageComponent),
});

export const routes: Routes = [
  {
    path: '',
    title: 'Pages',
    loadComponent: () => import('./pages').then((m) => m.Pages),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardPage),
      },
    ],
  },
];
