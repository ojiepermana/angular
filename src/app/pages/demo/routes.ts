import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../example').then(m => m.ExampleComponent)
  }
];
