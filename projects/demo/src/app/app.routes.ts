import type { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home.page';
import { NotFoundPageComponent } from './pages/placeholders/not-found.page';
import { GenericPlaceholderPageComponent } from './pages/placeholders/generic-placeholder.page';
import { DemoShellComponent } from './core/shells/demo-shell';

/**
 * Shared children for the demo shell.
 * Placeholders cover every entry in `navigation.data.ts`; the shadcn subtree
 * is lazy-loaded from `pages/ui/shadcn/ui-shadcn.routes.ts`.
 */
const shellChildren: Routes = [
  { path: '', component: HomePageComponent },
  // Documentation
  { path: 'docs', redirectTo: 'docs/introduction', pathMatch: 'full' },
  { path: 'docs/:slug', component: GenericPlaceholderPageComponent },
  { path: 'lucide-icons', component: GenericPlaceholderPageComponent },
  {
    path: 'ui/chart',
    loadChildren: () => import('./pages/ui/chart/chart.routes').then((m) => m.chartRoutes),
  },
  // Material + CDK placeholders — generic shell shows title from nav trail.
  { path: 'ui/material/:slug', component: GenericPlaceholderPageComponent },
  { path: 'ui/cdk/:slug', component: GenericPlaceholderPageComponent },
  // shadcn/ui — real showcase pages.
  {
    path: 'ui/shadcn',
    loadChildren: () => import('./pages/ui/shadcn/ui-shadcn.routes').then((m) => m.shadcnRoutes),
  },
  // Feature placeholders.
  { path: 'feature/:section/:slug', component: GenericPlaceholderPageComponent },
  { path: 'feature/:section/:subsection/:slug', component: GenericPlaceholderPageComponent },
];

export const routes: Routes = [
  { path: '', component: DemoShellComponent, children: shellChildren },
  { path: '**', component: NotFoundPageComponent },
];
