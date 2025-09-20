import { NavigationItem } from './types';

export const demoNavigationData: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
      {
        id: 'analytics',
        title: 'Analytics',
        type: 'basic',
        icon: '📊',
        link: '/dashboard/analytics'
      },
      {
        id: 'ecommerce',
        title: 'eCommerce',
        type: 'basic',
        icon: '🛒',
        link: '/dashboard/ecommerce'
      }
    ]
  },
  {
    id: 'divider1',
    type: 'divider'
  },
  {
    id: 'applications',
    title: 'Applications',
    type: 'group',
    children: [
      {
        id: 'ecommerce-app',
        title: 'eCommerce',
        type: 'collapsable',
        icon: '🏪',
        children: [
          {
            id: 'products',
            title: 'Products',
            type: 'basic',
            icon: '📦',
            link: '/apps/ecommerce/products'
          },
          {
            id: 'orders',
            title: 'Orders',
            type: 'basic',
            icon: '📋',
            link: '/apps/ecommerce/orders'
          },
          {
            id: 'customers',
            title: 'Customers',
            type: 'basic',
            icon: '👥',
            link: '/apps/ecommerce/customers'
          }
        ]
      },
      {
        id: 'academy',
        title: 'Academy',
        type: 'basic',
        icon: '🎓',
        link: '/apps/academy'
      },
      {
        id: 'calendar',
        title: 'Calendar',
        type: 'basic',
        icon: '📅',
        link: '/apps/calendar'
      },
      {
        id: 'chat',
        title: 'Chat',
        type: 'basic',
        icon: '💬',
        link: '/apps/chat'
      },
      {
        id: 'mailbox',
        title: 'Mailbox',
        type: 'basic',
        icon: '📧',
        link: '/apps/mailbox'
      }
    ]
  },
  {
    id: 'divider2',
    type: 'divider'
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    children: [
      {
        id: 'authentication',
        title: 'Authentication',
        type: 'collapsable',
        icon: '��',
        children: [
          {
            id: 'sign-in',
            title: 'Sign in',
            type: 'basic',
            icon: '🔑',
            link: '/pages/authentication/sign-in'
          },
          {
            id: 'sign-up',
            title: 'Sign up',
            type: 'basic',
            icon: '📝',
            link: '/pages/authentication/sign-up'
          },
          {
            id: 'sign-out',
            title: 'Sign out',
            type: 'basic',
            icon: '🚪',
            link: '/pages/authentication/sign-out'
          },
          {
            id: 'forgot-password',
            title: 'Forgot password',
            type: 'basic',
            icon: '🔑',
            link: '/pages/authentication/forgot-password'
          }
        ]
      },
      {
        id: 'coming-soon',
        title: 'Coming Soon',
        type: 'basic',
        icon: '🚧',
        link: '/pages/coming-soon'
      },
      {
        id: 'error',
        title: 'Error',
        type: 'collapsable',
        icon: '❌',
        children: [
          {
            id: '404',
            title: '404',
            type: 'basic',
            icon: '🔍',
            link: '/pages/error/404'
          },
          {
            id: '500',
            title: '500',
            type: 'basic',
            icon: '💥',
            link: '/pages/error/500'
          }
        ]
      }
    ]
  },
  {
    id: 'divider3',
    type: 'divider'
  },
  {
    id: 'user-interface',
    title: 'User Interface',
    type: 'group',
    children: [
      {
        id: 'material-components',
        title: 'Material Components',
        type: 'collapsable',
        icon: '🎨',
        children: [
          {
            id: 'buttons',
            title: 'Buttons',
            type: 'basic',
            icon: '🔘',
            link: '/ui/material/buttons'
          },
          {
            id: 'cards',
            title: 'Cards',
            type: 'basic',
            icon: '🃏',
            link: '/ui/material/cards'
          },
          {
            id: 'forms',
            title: 'Forms',
            type: 'basic',
            icon: '📝',
            link: '/ui/material/forms'
          }
        ]
      },
      {
        id: 'icons',
        title: 'Icons',
        type: 'collapsable',
        icon: '⭐',
        children: [
          {
            id: 'heroicons',
            title: 'Heroicons',
            type: 'basic',
            icon: '🦸',
            link: '/ui/icons/heroicons'
          },
          {
            id: 'material-icons',
            title: 'Material Icons',
            type: 'basic',
            icon: '🎭',
            link: '/ui/icons/material'
          }
        ]
      }
    ]
  },
  {
    id: 'divider4',
    type: 'divider'
  },
  {
    id: 'documentation',
    title: 'Documentation',
    type: 'group',
    children: [
      {
        id: 'guides',
        title: 'Guides',
        type: 'basic',
        icon: '📖',
        link: '/docs/guides'
      },
      {
        id: 'getting-started',
        title: 'Getting started',
        type: 'basic',
        icon: '🚀',
        link: '/docs/getting-started'
      },
      {
        id: 'changelog',
        title: 'Changelog',
        type: 'basic',
        icon: '📋',
        link: '/docs/changelog'
      }
    ]
  }
];
