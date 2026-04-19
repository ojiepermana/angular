import type { Route, Routes } from '@angular/router';

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
