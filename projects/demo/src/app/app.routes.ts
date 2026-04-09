import { Routes } from '@angular/router';
import { DemoHorizontalShellComponent } from './layouts/demo-horizontal-shell.component';
import { DemoVerticalShellComponent } from './layouts/demo-vertical-shell.component';
import { DemoDashboardPageComponent } from './pages/demo-dashboard-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'vertical',
  },
  {
    path: 'vertical',
    component: DemoVerticalShellComponent,
    children: [
      {
        path: '',
        component: DemoDashboardPageComponent,
      },
    ],
  },
  {
    path: 'horizontal',
    component: DemoHorizontalShellComponent,
    children: [
      {
        path: '',
        component: DemoDashboardPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'vertical',
  },
];
