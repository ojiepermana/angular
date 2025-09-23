import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { VerticalNavigation } from '../../../../../../../../projects/kit/src/lib/components/navigation/vertical/vertical-navigation';
import { demoNavigationData } from './navigations';

@Component({
  selector: 'navigation-vertical-thin',
  imports: [VerticalNavigation],
  template: `
    <op-vertical-navigation
                  name="demo-vertical-thin-default"
                  [navigation]="navigationData()"
                  variant="default"
                  appearance="thin">
                </op-vertical-navigation>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationVerticalThin {
  // Use local navigation data specific to thin appearance
  navigationData = signal(demoNavigationData);
}
