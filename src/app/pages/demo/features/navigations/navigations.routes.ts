import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'vertical',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
    loadChildren: () => import('./vertical/vertical.routes').then(m => m.routes)
  },
  {
    path: 'horizontal',
    loadChildren: () => import('./horizontal/horizontal.routes').then(m => m.routes)
  }
];
