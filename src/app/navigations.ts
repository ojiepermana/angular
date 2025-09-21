import { NavigationItem } from '../../projects/kit/src/lib/types/navigations.type';

export const demoNavigationData: NavigationItem[] = [
  {
    id: 'documentation',
    title: 'Documentation',
    subtitle: 'Guides and getting started resources',
    type: 'group',
    icon: 'menu_book',
    children: [
      {
        id: 'guides',
        title: 'Guides',
        type: 'basic',
        icon: 'menu_book',
        link: '/demo/docs/guides'
      },
      {
        id: 'getting-started',
        title: 'Getting started',
        type: 'basic',
        icon: 'rocket_launch',
        link: '/demo/docs/getting-started'
      },
      {
        id: 'changelog',
        title: 'Changelog',
        type: 'basic',
        icon: 'history',
        link: '/demo/docs/changelog'
      }
    ]
  },
  {
    id: 'divider1',
    type: 'divider'
  },
  {
    id: 'user-interface',
    title: 'User Interface',
    subtitle: 'Components and design elements',
    type: 'group',
    icon: 'dashboard',
    children: [
      {
        id: 'material-components',
        title: 'Material Components',
        type: 'collapsable',
        icon: 'widgets',
        children: [
          {
            id: 'inputs-forms',
            title: 'Inputs & Forms',
            type: 'collapsable',
            icon: 'input',
            children: [
              {
                id: 'autocomplete',
                title: 'Autocomplete',
                type: 'basic',
                icon: 'search',
                link: '/demo/ui/material/autocomplete'
              },
              {
                id: 'checkbox',
                title: 'Checkbox',
                type: 'basic',
                icon: 'check_box',
                link: '/demo/ui/material/checkbox'
              },
              {
                id: 'datepicker',
                title: 'Datepicker',
                type: 'basic',
                icon: 'date_range',
                link: '/demo/ui/material/datepicker'
              },
              {
                id: 'form-field',
                title: 'Form field',
                type: 'basic',
                icon: 'text_fields',
                link: '/demo/ui/material/form-field'
              },
              {
                id: 'input',
                title: 'Input',
                type: 'basic',
                icon: 'input',
                link: '/demo/ui/material/input'
              },
              {
                id: 'radio-button',
                title: 'Radio button',
                type: 'basic',
                icon: 'radio_button_checked',
                link: '/demo/ui/material/radio'
              },
              {
                id: 'select',
                title: 'Select',
                type: 'basic',
                icon: 'arrow_drop_down',
                link: '/demo/ui/material/select'
              },
              {
                id: 'slider',
                title: 'Slider',
                type: 'basic',
                icon: 'tune',
                link: '/demo/ui/material/slider'
              },
              {
                id: 'slide-toggle',
                title: 'Slide toggle',
                type: 'basic',
                icon: 'toggle_on',
                link: '/demo/ui/material/slide-toggle'
              }
            ]
          },
          {
            id: 'buttons-actions',
            title: 'Buttons & Actions',
            type: 'collapsable',
            icon: 'smart_button',
            children: [
              {
                id: 'button',
                title: 'Button',
                type: 'basic',
                icon: 'smart_button',
                link: '/demo/ui/material/button'
              },
              {
                id: 'button-toggle',
                title: 'Button toggle',
                type: 'basic',
                icon: 'view_week',
                link: '/demo/ui/material/button-toggle'
              },
              {
                id: 'chips',
                title: 'Chips',
                type: 'basic',
                icon: 'sell',
                link: '/demo/ui/material/chips',
                badge: { title: 'New', classes: 'ml-2 px-2 py-0.5 rounded-full text-xs bg-green-500 text-white' }
              },
              {
                id: 'menu',
                title: 'Menu',
                type: 'basic',
                icon: 'menu',
                link: '/demo/ui/material/menu'
              },
              {
                id: 'ripples',
                title: 'Ripples',
                type: 'basic',
                icon: 'touch_app',
                link: '/demo/ui/material/ripples'
              }
            ]
          },
          {
            id: 'layout-containers',
            title: 'Layout & Containers',
            type: 'collapsable',
            icon: 'view_quilt',
            children: [
              {
                id: 'card',
                title: 'Card',
                type: 'basic',
                icon: 'credit_card',
                link: '/demo/ui/material/card'
              },
              {
                id: 'divider',
                title: 'Divider',
                type: 'basic',
                icon: 'horizontal_rule',
                link: '/demo/ui/material/divider'
              },
              {
                id: 'expansion-panel',
                title: 'Expansion Panel',
                type: 'basic',
                icon: 'expand_more',
                link: '/demo/ui/material/expansion'
              },
              {
                id: 'grid-list',
                title: 'Grid list',
                type: 'basic',
                icon: 'grid_view',
                link: '/demo/ui/material/grid-list'
              },
              {
                id: 'list',
                title: 'List',
                type: 'basic',
                icon: 'list',
                link: '/demo/ui/material/list'
              },
              {
                id: 'sidenav',
                title: 'Sidenav',
                type: 'basic',
                icon: 'menu_open',
                link: '/demo/ui/material/sidenav'
              },
              {
                id: 'tabs',
                title: 'Tabs',
                type: 'basic',
                icon: 'tab',
                link: '/demo/ui/material/tabs'
              },
              {
                id: 'toolbar',
                title: 'Toolbar',
                type: 'basic',
                icon: 'build',
                link: '/demo/ui/material/toolbar'
              }
            ]
          },
          {
            id: 'data-display',
            title: 'Data & Display',
            type: 'collapsable',
            icon: 'analytics',
            children: [
              {
                id: 'badge',
                title: 'Badge',
                type: 'basic',
                icon: 'new_releases',
                link: '/demo/ui/material/badge'
              },
              {
                id: 'icon',
                title: 'Icon',
                type: 'basic',
                icon: 'star',
                link: '/demo/ui/material/icon'
              },
              {
                id: 'paginator',
                title: 'Paginator',
                type: 'basic',
                icon: 'keyboard_arrow_left',
                link: '/demo/ui/material/paginator'
              },
              {
                id: 'progress-bar',
                title: 'Progress bar',
                type: 'basic',
                icon: 'linear_scale',
                link: '/demo/ui/material/progress-bar'
              },
              {
                id: 'progress-spinner',
                title: 'Progress spinner',
                type: 'basic',
                icon: 'rotate_right',
                link: '/demo/ui/material/progress-spinner'
              },
              {
                id: 'sort',
                title: 'Sort header',
                type: 'basic',
                icon: 'sort',
                link: '/demo/ui/material/sort'
              },
              {
                id: 'table',
                title: 'Table',
                type: 'basic',
                icon: 'table_chart',
                link: '/demo/ui/material/table'
              },
              {
                id: 'tree',
                title: 'Tree',
                type: 'basic',
                icon: 'account_tree',
                link: '/demo/ui/material/tree'
              }
            ]
          },
          {
            id: 'overlays-modals',
            title: 'Overlays & Modals',
            type: 'collapsable',
            icon: 'layers',
            children: [
              {
                id: 'bottom-sheet',
                title: 'Bottom Sheet',
                type: 'basic',
                icon: 'vertical_align_bottom',
                link: '/demo/ui/material/bottom-sheet'
              },
              {
                id: 'dialog',
                title: 'Dialog',
                type: 'basic',
                icon: 'chat_bubble',
                link: '/demo/ui/material/dialog'
              },
              {
                id: 'snack-bar',
                title: 'Snack-bar',
                type: 'basic',
                icon: 'announcement',
                link: '/demo/ui/material/snack-bar'
              },
              {
                id: 'tooltip',
                title: 'Tooltip',
                type: 'basic',
                icon: 'help',
                link: '/demo/ui/material/tooltip'
              }
            ]
          },
          {
            id: 'navigation-stepper',
            title: 'Navigation & Steps',
            type: 'collapsable',
            icon: 'stairs',
            children: [
              {
                id: 'stepper',
                title: 'Stepper',
                type: 'basic',
                icon: 'stairs',
                link: '/demo/ui/material/stepper'
              }
            ]
          }
        ]
      },
      {
        id: 'angular-cdk',
        title: 'Angular CDK',
        type: 'collapsable',
        icon: 'construction',
        children: [
          {
            id: 'accessibility-navigation',
            title: 'Accessibility & Navigation',
            type: 'collapsable',
            icon: 'accessibility',
            children: [
              {
                id: 'a11y',
                title: 'Accessibility',
                type: 'basic',
                icon: 'accessibility',
                link: '/demo/ui/cdk/a11y'
              },
              {
                id: 'focus-trap',
                title: 'Focus Trap',
                type: 'basic',
                icon: 'center_focus_strong',
                link: '/demo/ui/cdk/focus-trap'
              },
              {
                id: 'live-announcer',
                title: 'Live Announcer',
                type: 'basic',
                icon: 'campaign',
                link: '/demo/ui/cdk/live-announcer'
              },
              {
                id: 'listbox',
                title: 'Listbox',
                type: 'basic',
                icon: 'list',
                link: '/demo/ui/cdk/listbox'
              },
              {
                id: 'menu-cdk',
                title: 'Menu',
                type: 'basic',
                icon: 'menu',
                link: '/demo/ui/cdk/menu'
              }
            ]
          },
          {
            id: 'layout-positioning',
            title: 'Layout & Positioning',
            type: 'collapsable',
            icon: 'dashboard',
            children: [
              {
                id: 'layout',
                title: 'Layout',
                type: 'basic',
                icon: 'view_quilt',
                link: '/demo/ui/cdk/layout'
              },
              {
                id: 'overlay',
                title: 'Overlay',
                type: 'basic',
                icon: 'layers',
                link: '/demo/ui/cdk/overlay'
              },
              {
                id: 'portal',
                title: 'Portal',
                type: 'basic',
                icon: 'input',
                link: '/demo/ui/cdk/portal'
              },
              {
                id: 'scrolling',
                title: 'Scrolling',
                type: 'basic',
                icon: 'unfold_more',
                link: '/demo/ui/cdk/scrolling'
              },
              {
                id: 'virtual-scrolling',
                title: 'Virtual Scrolling',
                type: 'basic',
                icon: 'view_stream',
                link: '/demo/ui/cdk/virtual-scrolling'
              }
            ]
          },
          {
            id: 'interaction-behavior',
            title: 'Interaction & Behavior',
            type: 'collapsable',
            icon: 'touch_app',
            children: [
              {
                id: 'drag-drop',
                title: 'Drag and Drop',
                type: 'basic',
                icon: 'open_with',
                link: '/demo/ui/cdk/drag-drop'
              },
              {
                id: 'observers',
                title: 'Observers',
                type: 'basic',
                icon: 'visibility',
                link: '/demo/ui/cdk/observers'
              },
              {
                id: 'platform',
                title: 'Platform',
                type: 'basic',
                icon: 'devices',
                link: '/demo/ui/cdk/platform'
              },
              {
                id: 'stepper-cdk',
                title: 'Stepper',
                type: 'basic',
                icon: 'stairs',
                link: '/demo/ui/cdk/stepper'
              }
            ]
          },
          {
            id: 'forms-data',
            title: 'Forms & Data',
            type: 'collapsable',
            icon: 'storage',
            children: [
              {
                id: 'accordion',
                title: 'Accordion',
                type: 'basic',
                icon: 'expand_more',
                link: '/demo/ui/cdk/accordion'
              },
              {
                id: 'table-cdk',
                title: 'Table',
                type: 'basic',
                icon: 'table_chart',
                link: '/demo/ui/cdk/table'
              },
              {
                id: 'tree-cdk',
                title: 'Tree',
                type: 'basic',
                icon: 'account_tree',
                link: '/demo/ui/cdk/tree'
              }
            ]
          },
          {
            id: 'utilities-helpers',
            title: 'Utilities & Helpers',
            type: 'collapsable',
            icon: 'build',
            children: [
              {
                id: 'bidi',
                title: 'Bidirectionality',
                type: 'basic',
                icon: 'compare_arrows',
                link: '/demo/ui/cdk/bidi'
              },
              {
                id: 'clipboard',
                title: 'Clipboard',
                type: 'basic',
                icon: 'content_copy',
                link: '/demo/ui/cdk/clipboard'
              },
              {
                id: 'coercion',
                title: 'Coercion',
                type: 'basic',
                icon: 'transform',
                link: '/demo/ui/cdk/coercion'
              },
              {
                id: 'collections',
                title: 'Collections',
                type: 'basic',
                icon: 'collections',
                link: '/demo/ui/cdk/collections'
              },
              {
                id: 'keycodes',
                title: 'Keycodes',
                type: 'basic',
                icon: 'keyboard',
                link: '/demo/ui/cdk/keycodes'
              }
            ]
          },
          {
            id: 'testing-tools',
            title: 'Testing Tools',
            type: 'collapsable',
            icon: 'bug_report',
            children: [
              {
                id: 'component-harnesses',
                title: 'Component Harnesses',
                type: 'basic',
                icon: 'science',
                link: '/demo/ui/cdk/testing'
              },
              {
                id: 'test-harnesses',
                title: 'Test Harnesses',
                type: 'basic',
                icon: 'quiz',
                link: '/demo/ui/cdk/test-harnesses'
              }
            ]
          },
          {
            id: 'advanced-features',
            title: 'Advanced Features',
            type: 'collapsable',
            icon: 'settings',
            children: [
              {
                id: 'dialog-cdk',
                title: 'Dialog',
                type: 'basic',
                icon: 'chat_bubble',
                link: '/demo/ui/cdk/dialog'
              },
              {
                id: 'text-field',
                title: 'Text Field',
                type: 'basic',
                icon: 'text_fields',
                link: '/demo/ui/cdk/text-field'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'divider2',
    type: 'divider'
  },
  {
    id: 'themes',
    title: 'Themes',
    subtitle: 'Styling and appearance options',
    type: 'group',
    icon: 'color_lens',
    children: [
      {
        id: 'dark-mode',
        title: 'Dark Mode',
        type: 'basic',
        icon: 'dark_mode',
        link: '/demo/themes/dark-mode'
      },
      {
        id: 'layout',
        title: 'Layout',
        type: 'basic',
        icon: 'view_quilt',
        link: '/demo/themes/layout'
      },
      {
        id: 'themes-color',
        title: 'Themes Variables',
        type: 'basic',
        icon: 'palette',
        link: '/demo/themes/color'
  ,badge: { title: 'Beta', classes: 'ml-2 px-2 py-0.5 rounded-full text-xs bg-yellow-500 text-white' }
      }
    ]
  }
];
