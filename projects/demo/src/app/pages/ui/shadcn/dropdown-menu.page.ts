import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ButtonComponent,
  MenuContentDirective,
  MenuItemComponent,
  MenuLabelComponent,
  MenuSeparatorComponent,
  MenuShortcutComponent,
  MenuSurfaceComponent,
  MenuTriggerDirective,
} from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-dropdown-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShellComponent,
    ButtonComponent,
    MenuContentDirective,
    MenuItemComponent,
    MenuLabelComponent,
    MenuSeparatorComponent,
    MenuShortcutComponent,
    MenuSurfaceComponent,
    MenuTriggerDirective,
  ],
  template: `
    <demo-page-shell title="Dropdown Menu" description="Menu anchored to a trigger via CDK overlay with keyboard a11y.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <button ui-button variant="outline" [uiMenuTrigger]="menu">Open menu</button>
        <ng-template uiMenuContent #menu="uiMenuContent">
          <ui-menu-surface>
            <ui-menu-label>My account</ui-menu-label>
            <button ui-menu-item>Profile <span ui-menu-shortcut>⌘P</span></button>
            <button ui-menu-item>Billing</button>
            <button ui-menu-item>Settings</button>
            <ui-menu-separator />
            <button ui-menu-item>New team</button>
            <button ui-menu-item [disabled]="true">Invite users</button>
            <ui-menu-separator />
            <button ui-menu-item>Log out <span ui-menu-shortcut>⇧⌘Q</span></button>
          </ui-menu-surface>
        </ng-template>
      </section>
    </demo-page-shell>
  `,
})
export class DropdownMenuPageComponent {}
