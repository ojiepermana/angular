import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demo').then(m => m.DemoPage),
    children: [
      {
          path: '',
          redirectTo: 'layouts',
          pathMatch: 'full'
      },
      {
        path: 'layouts',
        loadChildren: () => import('./layouts/layouts.routes').then(m => m.routes)
      },
      {
        path: 'material-symbols',
        loadComponent: () => import('./material-symbols-demo').then(m => m.MaterialSymbolsDemo)
      }

    ]
  }
];
