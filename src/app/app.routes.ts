import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/website/routes').then(m => m.routes)
  },
  {
    path: 'demo',
    loadComponent: () => import('./layouts/layout').then(m => m.Layout),
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/demo/demo.routes').then(m => m.routes)
      }
    ]
  }
];
