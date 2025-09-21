import { NavigationItem } from '../../../../projects/kit/src/lib/types/navigations.type';

export const demoNavigationData: NavigationItem[] = [
  {
    id: 'test-dropdown',
    title: 'Test Dropdown',
    type: 'collapsable',
    icon: 'expand_more',
    children: [
      {
        id: 'item1',
        title: 'Test Item 1',
        type: 'basic',
        icon: 'star',
        link: '/demo/test1'
      },
      {
        id: 'item2',
        title: 'Test Item 2',
        type: 'basic',
        icon: 'favorite',
        link: '/demo/test2'
      },
      {
        id: 'item3',
        title: 'Test Item 3',
        type: 'basic',
        icon: 'bookmark',
        link: '/demo/test3'
      }
    ]
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
    type: 'group',
    children: [
      {
        id: 'material-components',
        title: 'Material Components',
        type: 'collapsable',
        icon: 'widgets',
        children: [
          {
            id: 'autocomplete',
            title: 'Autocomplete',
            type: 'basic',
            icon: 'search',
            link: '/demo/ui/material/autocomplete'
          },
          {
            id: 'badge',
            title: 'Badge',
            type: 'basic',
            icon: 'new_releases',
            link: '/demo/ui/material/badge'
          },
          {
            id: 'bottom-sheet',
            title: 'Bottom Sheet',
            type: 'basic',
            icon: 'vertical_align_bottom',
            link: '/demo/ui/material/bottom-sheet'
          },
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
            id: 'card',
            title: 'Card',
            type: 'basic',
            icon: 'credit_card',
            link: '/demo/ui/material/card'
          },
          {
            id: 'checkbox',
            title: 'Checkbox',
            type: 'basic',
            icon: 'check_box',
            link: '/demo/ui/material/checkbox'
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
            id: 'datepicker',
            title: 'Datepicker',
            type: 'basic',
            icon: 'date_range',
            link: '/demo/ui/material/datepicker'
          },
          {
            id: 'dialog',
            title: 'Dialog',
            type: 'basic',
            icon: 'chat_bubble',
            link: '/demo/ui/material/dialog'
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
            id: 'form-field',
            title: 'Form field',
            type: 'basic',
            icon: 'text_fields',
            link: '/demo/ui/material/form-field'
          },
          {
            id: 'grid-list',
            title: 'Grid list',
            type: 'basic',
            icon: 'grid_view',
            link: '/demo/ui/material/grid-list'
          },
          {
            id: 'icon',
            title: 'Icon',
            type: 'basic',
            icon: 'star',
            link: '/demo/ui/material/icon'
          },
          {
            id: 'input',
            title: 'Input',
            type: 'basic',
            icon: 'input',
            link: '/demo/ui/material/input'
          },
          {
            id: 'list',
            title: 'List',
            type: 'basic',
            icon: 'list',
            link: '/demo/ui/material/list'
          },
          {
            id: 'menu',
            title: 'Menu',
            type: 'basic',
            icon: 'menu',
            link: '/demo/ui/material/menu'
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
            id: 'radio-button',
            title: 'Radio button',
            type: 'basic',
            icon: 'radio_button_checked',
            link: '/demo/ui/material/radio'
          },
          {
            id: 'ripples',
            title: 'Ripples',
            type: 'basic',
            icon: 'touch_app',
            link: '/demo/ui/material/ripples'
          },
          {
            id: 'select',
            title: 'Select',
            type: 'basic',
            icon: 'arrow_drop_down',
            link: '/demo/ui/material/select'
          },
          {
            id: 'sidenav',
            title: 'Sidenav',
            type: 'basic',
            icon: 'menu_open',
            link: '/demo/ui/material/sidenav'
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
          },
          {
            id: 'snack-bar',
            title: 'Snack-bar',
            type: 'basic',
            icon: 'announcement',
            link: '/demo/ui/material/snack-bar'
          },
          {
            id: 'sort',
            title: 'Sort header',
            type: 'basic',
            icon: 'sort',
            link: '/demo/ui/material/sort'
          },
          {
            id: 'stepper',
            title: 'Stepper',
            type: 'basic',
            icon: 'stairs',
            link: '/demo/ui/material/stepper'
          },
          {
            id: 'table',
            title: 'Table',
            type: 'basic',
            icon: 'table_chart',
            link: '/demo/ui/material/table'
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
          },
          {
            id: 'tooltip',
            title: 'Tooltip',
            type: 'basic',
            icon: 'help',
            link: '/demo/ui/material/tooltip'
          },
          {
            id: 'tree',
            title: 'Tree',
            type: 'basic',
            icon: 'account_tree',
            link: '/demo/ui/material/tree'
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
    type: 'group',
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
