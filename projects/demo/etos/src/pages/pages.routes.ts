import type { Route, Routes } from '@angular/router';

const pendingRoute = (segment: string, sectionLabel: string): Route => ({
  path: `ui/${segment}/:feature`,
  data: { sectionLabel },
  loadComponent: () => import('../../../library/src/pages/pending-demo.page').then((m) => m.PendingDemoPageComponent),
});

export const routes: Routes = [
  {
    path: '',
    title: 'Pages',
    loadComponent: () => import('./pages').then((m) => m.Pages),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardPage),
      },
      {
        path: 'ui/shadcn',
        title: 'shadcn UI',
        loadChildren: () =>
          import('../../../library/src/pages/ui/component/shadcn/ui-shadcn.routes').then((m) => m.shadcnRoutes),
      },
      {
        path: 'ui/chart',
        title: 'Chart demos',
        loadChildren: () =>
          import('../../../library/src/pages/ui/component/chart/chart.routes').then((m) => m.chartRoutes),
      },
      pendingRoute('material', 'Angular Material'),
      pendingRoute('cdk', 'Angular CDK'),
    ],
  },
];
