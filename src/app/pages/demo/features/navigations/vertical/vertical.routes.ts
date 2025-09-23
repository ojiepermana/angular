import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'default',
    pathMatch: 'full'
  },
  {
    path: 'default',
    loadComponent: () => import('./default/default').then(m => m.NavigationVerticalDefault)
  },
  {
    path: 'compact',
    loadComponent: () => import('./compact/compact').then(m => m.NavigationVerticalCompact)
  },
  {
    path: 'thin',
    loadComponent: () => import('./thin/thin').then(m => m.NavigationVerticalThin)
  }
];
