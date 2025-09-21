import { Component, input } from '@angular/core';
import { NavigationItem } from '../../../types/navigations.type';

@Component({
  selector: 'op-vertical-navigation-divider-item',
  template: `
    <div class="op-navigation-divider my-2">
      <div class="border-t border-gray-200"></div>
    </div>
  `
})
export class VerticalNavigationDividerItem {
  item = input.required<NavigationItem>();
}
