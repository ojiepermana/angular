import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Pages',
    loadComponent: () => import('./pages').then((m) => m.Pages),
  },
];
