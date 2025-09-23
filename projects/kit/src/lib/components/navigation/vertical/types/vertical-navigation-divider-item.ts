import { Component, input, computed } from '@angular/core';
import { NavigationItem } from '../../../../types/navigations.type';

@Component({
  selector: 'op-vertical-navigation-divider-item',
  host: {
    '[class]': 'glassClass()'
  },
  template: `
    <div class="op-navigation-divider my-2">
      <div class="border-t border-gray-200"></div>
    </div>
  `
})
export class VerticalNavigationDividerItem {
  item = input.required<NavigationItem>();
  variant = input<'default' | 'glass'>('default');

  // Computed glass class for host binding
  glassClass = computed(() => {
    return this.variant() === 'glass' ? 'op-vertical-navigation-divider-item-glass' : '';
  });
}
