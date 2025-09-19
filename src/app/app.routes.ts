import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/website/routes').then(m => m.routes)
  },
  {
    path: 'demo',
    loadChildren: () => import('./pages/demo/routes').then(m => m.routes)
  }
];
