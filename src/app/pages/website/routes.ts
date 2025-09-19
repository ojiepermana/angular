import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.WebsiteLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./website').then(m => m.WebsiteComponent)
      }
    ]
  }
];
