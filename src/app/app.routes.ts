import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./example').then(m => m.ExampleComponent)
  },
  {
    path: 'material-icons',
    loadComponent: () => import('./components/material-icons-demo').then(m => m.MaterialIconsDemoComponent)
  }
];
