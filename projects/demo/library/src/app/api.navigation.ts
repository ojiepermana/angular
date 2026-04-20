import type { NavigationItem } from '@ojiepermana/angular/navigation';

/**
 * Demo consumer sample for `@ojiepermana/angular/generator/api`.
 *
 * The real generator emits `api.navigation.ts` with an `ApiNavigation` export
 * when `features.navigation === true`. This app imports that shape directly and
 * registers it through `NavigationService` via `AppNavigation`.
 */
export const ApiNavigation: NavigationItem[] = [
  {
    id: 'generated-api-navigation',
    title: 'Generated API SDK',
    subtitle: 'Example of consuming ApiNavigation emitted by the SDK generator.',
    type: 'group',
    icon: 'api',
    children: [
      {
        id: 'generated-api-navigation-health',
        title: 'Health',
        subtitle: 'Gateway monitoring and liveness endpoints.',
        type: 'basic',
        icon: 'monitor_heart',
      },
      {
        id: 'generated-api-navigation-auth',
        title: 'Auth',
        subtitle: 'Registration, magic-link authentication, and logout endpoints.',
        type: 'basic',
        icon: 'verified_user',
      },
      {
        id: 'generated-api-navigation-user',
        title: 'User',
        subtitle: 'User directory and self-service profile endpoints.',
        type: 'basic',
        icon: 'group',
      },
      {
        id: 'generated-api-navigation-access',
        title: 'Access',
        subtitle: 'Gateway-published ACL endpoints exposed under /v1/access/*.',
        type: 'collapsable',
        icon: 'vpn_key',
        children: [
          {
            id: 'generated-api-navigation-access-role',
            title: 'Role',
            subtitle: 'Role master data management endpoints.',
            type: 'basic',
            icon: 'badge',
          },
          {
            id: 'generated-api-navigation-access-permission',
            title: 'Permission',
            subtitle: 'Permission master data and lookup endpoints.',
            type: 'basic',
            icon: 'key',
          },
          {
            id: 'generated-api-navigation-access-role-user',
            title: 'Role User',
            subtitle: 'Role-to-user assignment endpoints.',
            type: 'basic',
            icon: 'manage_accounts',
          },
        ],
      },
      {
        id: 'generated-api-navigation-approval',
        title: 'Approval',
        subtitle: 'Approval definition and workflow endpoints under /v1/approval/*.',
        type: 'collapsable',
        icon: 'approval',
        children: [
          {
            id: 'generated-api-navigation-approval-definition',
            title: 'Definition',
            subtitle: 'Approval definition master data endpoints.',
            type: 'basic',
            icon: 'inventory_2',
          },
          {
            id: 'generated-api-navigation-approval-stage',
            title: 'Stage',
            subtitle: 'Approval stage master data endpoints.',
            type: 'basic',
            icon: 'checklist',
          },
          {
            id: 'generated-api-navigation-approval-instance',
            title: 'Instance',
            subtitle: 'Approval submit, decision, detail, and pending endpoints.',
            type: 'basic',
            icon: 'fact_check',
          },
        ],
      },
    ],
  },
];
