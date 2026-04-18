import type { Routes } from '@angular/router';

/**
 * shadcn/ui showcase routes. Each page uses `loadComponent` so the shadcn
 * subtree is splittable from Material/CDK placeholders.
 */
export const shadcnRoutes: Routes = [
  { path: '', redirectTo: 'button', pathMatch: 'full' },
  { path: 'accordion', loadComponent: () => import('./accordion.page').then((m) => m.AccordionPageComponent) },
  { path: 'alert', loadComponent: () => import('./alert.page').then((m) => m.AlertPageComponent) },
  { path: 'avatar', loadComponent: () => import('./avatar.page').then((m) => m.AvatarPageComponent) },
  { path: 'badge', loadComponent: () => import('./badge.page').then((m) => m.BadgePageComponent) },
  { path: 'breadcrumb', loadComponent: () => import('./breadcrumb.page').then((m) => m.BreadcrumbPageComponent) },
  { path: 'button', loadComponent: () => import('./button.page').then((m) => m.ButtonPageComponent) },
  { path: 'calendar', loadComponent: () => import('./calendar.page').then((m) => m.CalendarPageComponent) },
  { path: 'card', loadComponent: () => import('./card.page').then((m) => m.CardPageComponent) },
  { path: 'checkbox', loadComponent: () => import('./checkbox.page').then((m) => m.CheckboxPageComponent) },
  { path: 'combobox', loadComponent: () => import('./combobox.page').then((m) => m.ComboboxPageComponent) },
  { path: 'command', loadComponent: () => import('./command.page').then((m) => m.CommandPageComponent) },
  { path: 'context-menu', loadComponent: () => import('./context-menu.page').then((m) => m.ContextMenuPageComponent) },
  { path: 'date-picker', loadComponent: () => import('./date-picker.page').then((m) => m.DatePickerPageComponent) },
  { path: 'dialog', loadComponent: () => import('./dialog.page').then((m) => m.DialogPageComponent) },
  {
    path: 'dropdown-menu',
    loadComponent: () => import('./dropdown-menu.page').then((m) => m.DropdownMenuPageComponent),
  },
  { path: 'form', loadComponent: () => import('./form.page').then((m) => m.FormPageComponent) },
  { path: 'input', loadComponent: () => import('./input.page').then((m) => m.InputPageComponent) },
  { path: 'label', loadComponent: () => import('./label.page').then((m) => m.LabelPageComponent) },
  { path: 'pagination', loadComponent: () => import('./pagination.page').then((m) => m.PaginationPageComponent) },
  { path: 'popover', loadComponent: () => import('./popover.page').then((m) => m.PopoverPageComponent) },
  { path: 'progress', loadComponent: () => import('./progress.page').then((m) => m.ProgressPageComponent) },
  { path: 'radio', loadComponent: () => import('./radio.page').then((m) => m.RadioPageComponent) },
  { path: 'scroll-area', loadComponent: () => import('./scroll-area.page').then((m) => m.ScrollAreaPageComponent) },
  { path: 'select', loadComponent: () => import('./select.page').then((m) => m.SelectPageComponent) },
  { path: 'separator', loadComponent: () => import('./separator.page').then((m) => m.SeparatorPageComponent) },
  { path: 'sheet', loadComponent: () => import('./sheet.page').then((m) => m.SheetPageComponent) },
  { path: 'skeleton', loadComponent: () => import('./skeleton.page').then((m) => m.SkeletonPageComponent) },
  { path: 'slider', loadComponent: () => import('./slider.page').then((m) => m.SliderPageComponent) },
  { path: 'switch', loadComponent: () => import('./switch.page').then((m) => m.SwitchPageComponent) },
  { path: 'table', loadComponent: () => import('./table.page').then((m) => m.TablePageComponent) },
  { path: 'tabs', loadComponent: () => import('./tabs.page').then((m) => m.TabsPageComponent) },
  { path: 'textarea', loadComponent: () => import('./textarea.page').then((m) => m.TextareaPageComponent) },
  { path: 'toast', loadComponent: () => import('./toast.page').then((m) => m.ToastPageComponent) },
  { path: 'tooltip', loadComponent: () => import('./tooltip.page').then((m) => m.TooltipPageComponent) },
];
