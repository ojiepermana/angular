import { NavigationItem } from '../../../../../../../../projects/kit/src/lib/types/navigations.type';

export const demoNavigationData: NavigationItem[] = [
  {
    id: 'documentation',
    title: 'Documentation',
    subtitle: 'Guides and getting started resources',
    type: 'aside',
    icon: 'menu_book',
    children: [
      {
        id: 'documentation-introduction',
        title: 'Introduction',
        type: 'basic',
        icon: 'menu_book',
        link: '/demo/docs/introduction'
      },
      {
        id: 'documentation-installation',
        title: 'Installation',
        type: 'basic',
        icon: 'download',
        link: '/demo/docs/installation'
      },
      {
        id: 'documentation-getting-started',
        title: 'Getting started',
        type: 'basic',
        icon: 'rocket_launch',
        link: '/demo/docs/getting-started'
      },
      {
        id: 'documentation-upgrade-guide',
        title: 'Upgrade Guide',
        type: 'basic',
        icon: 'upgrade',
        link: '/demo/docs/upgrade-guide'
      },
      {
        id: 'documentation-changelog',
        title: 'Changelog',
        type: 'basic',
        icon: 'history',
        link: '/demo/docs/changelog'
      },
      {
        id: 'documentation-material-icons',
        title: 'Material Icons',
        type: 'basic',
        icon: 'insert_emoticon',
        link: '/demo/material-icons',
        badge: { title: 'Demo', classes: 'ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-500 text-white' }
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
    type: 'aside',
    icon: 'dashboard',
    children: [
      {
        id: 'user-interface-material-components',
        title: 'Material Components',
        type: 'collapsable',
        icon: 'widgets',
        children: [
          {
            id: 'user-interface-material-components-inputs-forms',
            title: 'Inputs & Forms',
            type: 'collapsable',
            icon: 'input',
            children: [
              {
                id: 'user-interface-material-components-inputs-forms-autocomplete',
                title: 'Autocomplete',
                type: 'basic',
                icon: 'search',
                link: '/demo/ui/material/autocomplete'
              },
              {
                id: 'user-interface-material-components-inputs-forms-checkbox',
                title: 'Checkbox',
                type: 'basic',
                icon: 'check_box',
                link: '/demo/ui/material/checkbox'
              },
              {
                id: 'user-interface-material-components-inputs-forms-datepicker',
                title: 'Datepicker',
                type: 'basic',
                icon: 'date_range',
                link: '/demo/ui/material/datepicker'
              },
              {
                id: 'user-interface-material-components-inputs-forms-form-field',
                title: 'Form field',
                type: 'basic',
                icon: 'text_fields',
                link: '/demo/ui/material/form-field'
              },
              {
                id: 'user-interface-material-components-inputs-forms-input',
                title: 'Input',
                type: 'basic',
                icon: 'input',
                link: '/demo/ui/material/input'
              },
              {
                id: 'user-interface-material-components-inputs-forms-radio-button',
                title: 'Radio button',
                type: 'basic',
                icon: 'radio_button_checked',
                link: '/demo/ui/material/radio'
              },
              {
                id: 'user-interface-material-components-inputs-forms-select',
                title: 'Select',
                type: 'basic',
                icon: 'arrow_drop_down',
                link: '/demo/ui/material/select'
              },
              {
                id: 'user-interface-material-components-inputs-forms-slider',
                title: 'Slider',
                type: 'basic',
                icon: 'tune',
                link: '/demo/ui/material/slider'
              },
              {
                id: 'user-interface-material-components-inputs-forms-slide-toggle',
                title: 'Slide toggle',
                type: 'basic',
                icon: 'toggle_on',
                link: '/demo/ui/material/slide-toggle'
              }
            ]
          },
          {
            id: 'user-interface-material-components-buttons-actions',
            title: 'Buttons & Actions',
            type: 'collapsable',
            icon: 'smart_button',
            children: [
              {
                id: 'user-interface-material-components-buttons-actions-button',
                title: 'Button',
                type: 'basic',
                icon: 'smart_button',
                link: '/demo/ui/material/button'
              },
              {
                id: 'user-interface-material-components-buttons-actions-button-toggle',
                title: 'Button toggle',
                type: 'basic',
                icon: 'view_week',
                link: '/demo/ui/material/button-toggle'
              },
              {
                id: 'user-interface-material-components-buttons-actions-chips',
                title: 'Chips',
                type: 'basic',
                icon: 'sell',
                link: '/demo/ui/material/chips',
                badge: { title: 'New', classes: 'ml-2 px-2 py-0.5 rounded-full text-xs bg-green-500 text-white' }
              },
              {
                id: 'user-interface-material-components-buttons-actions-menu',
                title: 'Menu',
                type: 'basic',
                icon: 'menu',
                link: '/demo/ui/material/menu'
              },
              {
                id: 'user-interface-material-components-buttons-actions-ripples',
                title: 'Ripples',
                type: 'basic',
                icon: 'touch_app',
                link: '/demo/ui/material/ripples'
              }
            ]
          },
          {
            id: 'user-interface-material-components-layout-containers',
            title: 'Layout & Containers',
            type: 'collapsable',
            icon: 'view_quilt',
            children: [
              {
                id: 'user-interface-material-components-layout-containers-card',
                title: 'Card',
                type: 'basic',
                icon: 'credit_card',
                link: '/demo/ui/material/card'
              },
              {
                id: 'user-interface-material-components-layout-containers-divider',
                title: 'Divider',
                type: 'basic',
                icon: 'horizontal_rule',
                link: '/demo/ui/material/divider'
              },
              {
                id: 'user-interface-material-components-layout-containers-expansion-panel',
                title: 'Expansion Panel',
                type: 'basic',
                icon: 'expand_more',
                link: '/demo/ui/material/expansion'
              },
              {
                id: 'user-interface-material-components-layout-containers-grid-list',
                title: 'Grid list',
                type: 'basic',
                icon: 'grid_view',
                link: '/demo/ui/material/grid-list'
              },
              {
                id: 'user-interface-material-components-layout-containers-list',
                title: 'List',
                type: 'basic',
                icon: 'list',
                link: '/demo/ui/material/list'
              },
              {
                id: 'user-interface-material-components-layout-containers-sidenav',
                title: 'Sidenav',
                type: 'basic',
                icon: 'menu_open',
                link: '/demo/ui/material/sidenav'
              },
              {
                id: 'user-interface-material-components-layout-containers-tabs',
                title: 'Tabs',
                type: 'basic',
                icon: 'tab',
                link: '/demo/ui/material/tabs'
              },
              {
                id: 'user-interface-material-components-layout-containers-toolbar',
                title: 'Toolbar',
                type: 'basic',
                icon: 'build',
                link: '/demo/ui/material/toolbar'
              }
            ]
          },
          {
            id: 'user-interface-material-components-data-display',
            title: 'Data & Display',
            type: 'collapsable',
            icon: 'analytics',
            children: [
              {
                id: 'user-interface-material-components-data-display-badge',
                title: 'Badge',
                type: 'basic',
                icon: 'new_releases',
                link: '/demo/ui/material/badge'
              },
              {
                id: 'user-interface-material-components-data-display-icon',
                title: 'Icon',
                type: 'basic',
                icon: 'star',
                link: '/demo/ui/material/icon'
              },
              {
                id: 'user-interface-material-components-data-display-paginator',
                title: 'Paginator',
                type: 'basic',
                icon: 'keyboard_arrow_left',
                link: '/demo/ui/material/paginator'
              },
              {
                id: 'user-interface-material-components-data-display-progress-bar',
                title: 'Progress bar',
                type: 'basic',
                icon: 'linear_scale',
                link: '/demo/ui/material/progress-bar'
              },
              {
                id: 'user-interface-material-components-data-display-progress-spinner',
                title: 'Progress spinner',
                type: 'basic',
                icon: 'rotate_right',
                link: '/demo/ui/material/progress-spinner'
              },
              {
                id: 'user-interface-material-components-data-display-sort',
                title: 'Sort header',
                type: 'basic',
                icon: 'sort',
                link: '/demo/ui/material/sort'
              },
              {
                id: 'user-interface-material-components-data-display-table',
                title: 'Table',
                type: 'basic',
                icon: 'table_chart',
                link: '/demo/ui/material/table'
              },
              {
                id: 'user-interface-material-components-data-display-tree',
                title: 'Tree',
                type: 'basic',
                icon: 'account_tree',
                link: '/demo/ui/material/tree'
              }
            ]
          },
          {
            id: 'user-interface-material-components-overlays-modals',
            title: 'Overlays & Modals',
            type: 'collapsable',
            icon: 'layers',
            children: [
              {
                id: 'user-interface-material-components-overlays-modals-bottom-sheet',
                title: 'Bottom Sheet',
                type: 'basic',
                icon: 'vertical_align_bottom',
                link: '/demo/ui/material/bottom-sheet'
              },
              {
                id: 'user-interface-material-components-overlays-modals-dialog',
                title: 'Dialog',
                type: 'basic',
                icon: 'chat_bubble',
                link: '/demo/ui/material/dialog'
              },
              {
                id: 'user-interface-material-components-overlays-modals-snack-bar',
                title: 'Snack-bar',
                type: 'basic',
                icon: 'announcement',
                link: '/demo/ui/material/snack-bar'
              },
              {
                id: 'user-interface-material-components-overlays-modals-tooltip',
                title: 'Tooltip',
                type: 'basic',
                icon: 'help',
                link: '/demo/ui/material/tooltip'
              }
            ]
          },
          {
            id: 'user-interface-material-components-navigation-stepper',
            title: 'Navigation & Steps',
            type: 'collapsable',
            icon: 'stairs',
            children: [
              {
                id: 'user-interface-material-components-navigation-stepper-stepper',
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
        id: 'user-interface-angular-cdk',
        title: 'Angular CDK',
        type: 'collapsable',
        icon: 'construction',
        children: [
          {
            id: 'user-interface-angular-cdk-accessibility-navigation',
            title: 'Accessibility & Navigation',
            type: 'collapsable',
            icon: 'accessibility',
            children: [
              {
                id: 'user-interface-angular-cdk-accessibility-navigation-a11y',
                title: 'Accessibility',
                type: 'basic',
                icon: 'accessibility',
                link: '/demo/ui/cdk/a11y'
              },
              {
                id: 'user-interface-angular-cdk-accessibility-navigation-focus-trap',
                title: 'Focus Trap',
                type: 'basic',
                icon: 'center_focus_strong',
                link: '/demo/ui/cdk/focus-trap'
              },
              {
                id: 'user-interface-angular-cdk-accessibility-navigation-live-announcer',
                title: 'Live Announcer',
                type: 'basic',
                icon: 'campaign',
                link: '/demo/ui/cdk/live-announcer'
              },
              {
                id: 'user-interface-angular-cdk-accessibility-navigation-listbox',
                title: 'Listbox',
                type: 'basic',
                icon: 'list',
                link: '/demo/ui/cdk/listbox'
              },
              {
                id: 'user-interface-angular-cdk-accessibility-navigation-menu-cdk',
                title: 'Menu',
                type: 'basic',
                icon: 'menu',
                link: '/demo/ui/cdk/menu'
              }
            ]
          },
          {
            id: 'user-interface-angular-cdk-layout-positioning',
            title: 'Layout & Positioning',
            type: 'collapsable',
            icon: 'dashboard',
            children: [
              {
                id: 'user-interface-angular-cdk-layout-positioning-layout',
                title: 'Layout',
                type: 'basic',
                icon: 'view_quilt',
                link: '/demo/ui/cdk/layout'
              },
              {
                id: 'user-interface-angular-cdk-layout-positioning-overlay',
                title: 'Overlay',
                type: 'basic',
                icon: 'layers',
                link: '/demo/ui/cdk/overlay'
              },
              {
                id: 'user-interface-angular-cdk-layout-positioning-portal',
                title: 'Portal',
                type: 'basic',
                icon: 'input',
                link: '/demo/ui/cdk/portal'
              },
              {
                id: 'user-interface-angular-cdk-layout-positioning-scrolling',
                title: 'Scrolling',
                type: 'basic',
                icon: 'unfold_more',
                link: '/demo/ui/cdk/scrolling'
              },
              {
                id: 'user-interface-angular-cdk-layout-positioning-virtual-scrolling',
                title: 'Virtual Scrolling',
                type: 'basic',
                icon: 'view_stream',
                link: '/demo/ui/cdk/virtual-scrolling'
              }
            ]
          },
          {
            id: 'user-interface-angular-cdk-interaction-behavior',
            title: 'Interaction & Behavior',
            type: 'collapsable',
            icon: 'touch_app',
            children: [
              {
                id: 'user-interface-angular-cdk-interaction-behavior-drag-drop',
                title: 'Drag and Drop',
                type: 'basic',
                icon: 'open_with',
                link: '/demo/ui/cdk/drag-drop'
              },
              {
                id: 'user-interface-angular-cdk-interaction-behavior-observers',
                title: 'Observers',
                type: 'basic',
                icon: 'visibility',
                link: '/demo/ui/cdk/observers'
              },
              {
                id: 'user-interface-angular-cdk-interaction-behavior-platform',
                title: 'Platform',
                type: 'basic',
                icon: 'devices',
                link: '/demo/ui/cdk/platform'
              },
              {
                id: 'user-interface-angular-cdk-interaction-behavior-stepper-cdk',
                title: 'Stepper',
                type: 'basic',
                icon: 'stairs',
                link: '/demo/ui/cdk/stepper'
              }
            ]
          },
          {
            id: 'user-interface-angular-cdk-forms-data',
            title: 'Forms & Data',
            type: 'collapsable',
            icon: 'storage',
            children: [
              {
                id: 'user-interface-angular-cdk-forms-data-accordion',
                title: 'Accordion',
                type: 'basic',
                icon: 'expand_more',
                link: '/demo/ui/cdk/accordion'
              },
              {
                id: 'user-interface-angular-cdk-forms-data-table-cdk',
                title: 'Table',
                type: 'basic',
                icon: 'table_chart',
                link: '/demo/ui/cdk/table'
              },
              {
                id: 'user-interface-angular-cdk-forms-data-tree-cdk',
                title: 'Tree',
                type: 'basic',
                icon: 'account_tree',
                link: '/demo/ui/cdk/tree'
              }
            ]
          },
          {
            id: 'user-interface-angular-cdk-utilities-helpers',
            title: 'Utilities & Helpers',
            type: 'collapsable',
            icon: 'build',
            children: [
              {
                id: 'user-interface-angular-cdk-utilities-helpers-bidi',
                title: 'Bidirectionality',
                type: 'basic',
                icon: 'compare_arrows',
                link: '/demo/ui/cdk/bidi'
              },
              {
                id: 'user-interface-angular-cdk-utilities-helpers-clipboard',
                title: 'Clipboard',
                type: 'basic',
                icon: 'content_copy',
                link: '/demo/ui/cdk/clipboard'
              },
              {
                id: 'user-interface-angular-cdk-utilities-helpers-coercion',
                title: 'Coercion',
                type: 'basic',
                icon: 'transform',
                link: '/demo/ui/cdk/coercion'
              },
              {
                id: 'user-interface-angular-cdk-utilities-helpers-collections',
                title: 'Collections',
                type: 'basic',
                icon: 'collections',
                link: '/demo/ui/cdk/collections'
              },
              {
                id: 'user-interface-angular-cdk-utilities-helpers-keycodes',
                title: 'Keycodes',
                type: 'basic',
                icon: 'keyboard',
                link: '/demo/ui/cdk/keycodes'
              }
            ]
          },
          {
            id: 'user-interface-angular-cdk-testing-tools',
            title: 'Testing Tools',
            type: 'collapsable',
            icon: 'bug_report',
            children: [
              {
                id: 'user-interface-angular-cdk-testing-tools-component-harnesses',
                title: 'Component Harnesses',
                type: 'basic',
                icon: 'science',
                link: '/demo/ui/cdk/testing'
              },
              {
                id: 'user-interface-angular-cdk-testing-tools-test-harnesses',
                title: 'Test Harnesses',
                type: 'basic',
                icon: 'quiz',
                link: '/demo/ui/cdk/test-harnesses'
              }
            ]
          },
          {
            id: 'user-interface-angular-cdk-advanced-features',
            title: 'Advanced Features',
            type: 'collapsable',
            icon: 'settings',
            children: [
              {
                id: 'user-interface-angular-cdk-advanced-features-dialog-cdk',
                title: 'Dialog',
                type: 'basic',
                icon: 'chat_bubble',
                link: '/demo/ui/cdk/dialog'
              },
              {
                id: 'user-interface-angular-cdk-advanced-features-text-field',
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
    id: 'features',
    title: 'Features',
    subtitle: 'Advanced functionality and customization options',
    type: 'aside',
    icon: 'settings',
    children: [
      {
    id: 'features-themes',
    title: 'Themes',
    type: 'collapsable',
    icon: 'color_lens',
    children: [
      {
        id: 'features-themes-dark-mode',
        title: 'Dark Mode',
        type: 'basic',
        icon: 'dark_mode',
        link: '/demo/themes/dark-mode'
      },
      {
        id: 'features-themes-layout',
        title: 'Layout',
        type: 'collapsable',
        icon: 'view_quilt',
        children: [
          {
            id: 'features-themes-layout-apps',
            title: 'Application',
            type: 'basic',
            icon: 'apps',
            link: '/demo/features/themes/layout/apps'
          },
          {
            id: 'features-themes-layout-pages',
            title: 'Pages',
            type: 'basic',
            icon: 'pages',
            link: '/demo/features/themes/layout/pages'
          }
        ]
      },
      {
        id: 'features-themes-color',
        title: 'Themes Variables',
        type: 'basic',
        icon: 'palette',
        link: '/demo/themes/color'
  ,badge: { title: 'Beta', classes: 'ml-2 px-2 py-0.5 rounded-full text-xs bg-yellow-500 text-white' }
      }
    ]
  },
      {
        id: 'features-navigation',
        title: 'Navigation',
        type: 'collapsable',
        icon: 'navigation',
        children: [
          {
            id: 'features-navigation-horizontal-navigation',
            title: 'Horizontal ',
            type: 'basic',
            icon: 'view_week',
            link: '/demo/features/navigation/horizontal'
          },
          {
            id: 'features-navigation-vertical-navigation',
            title: 'Vertical ',
            type: 'collapsable',
            icon: 'view_stream',
            children: [
              {
                id: 'features-navigation-vertical-navigation-default',
                title: 'Default',
                type: 'basic',
                icon: 'view_stream',
                link: '/demo/features/navigation/vertical/default'
              },
              {
                id: 'features-navigation-vertical-navigation-thin',
                title: 'Thin',
                type: 'basic',
                icon: 'view_stream',
                link: '/demo/features/navigation/vertical/thin'
              },
              {
                id: 'features-navigation-vertical-navigation-compact',
                title: 'Compact',
                type: 'basic',
                icon: 'view_stream',
                link: '/demo/features/navigation/vertical/compact'
              },
              {
                id: 'features-navigation-vertical-navigation-dense',
                title: 'Dense',
                type: 'basic',
                icon: 'view_stream',
                link: '/demo/features/navigation/vertical/dense'
              }
            ]
          }
        ]
      }
    ]
  }
];
