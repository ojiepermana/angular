import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../example').then(m => m.ExampleComponent)
  },
  {
    path: 'layout',
    loadComponent: () => import('../../components/layout-demo.component').then(m => m.LayoutDemoComponent)
  },
  {
    path: 'themes',
    loadComponent: () => import('../../components/themes-demo.component').then(m => m.ThemesDemoComponent)
  },
  {
    path: 'variables',
    loadComponent: () => import('../../components/variables-demo.component').then(m => m.VariablesDemoComponent)
  }
];
