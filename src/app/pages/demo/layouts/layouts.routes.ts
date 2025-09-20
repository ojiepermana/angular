import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'themes',
    pathMatch: 'full'
  },
  {
    path: 'themes',
    loadComponent: () => import('./themes').then(m => m.LayoutThemes)
  }
];
