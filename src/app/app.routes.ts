import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./example.component').then(m => m.ExampleComponent)
  }
];
