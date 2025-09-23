import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'default',
    pathMatch: 'full'
  },
  {
    path: 'default',
    loadComponent: () => import('./default').then(m => m.NavigationVerticalDefault)
  },
  {
    path: 'compact',
    loadComponent: () => import('./compact').then(m => m.NavigationVerticalCompact)
  }
];
