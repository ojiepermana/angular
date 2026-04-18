import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ContextMenuTriggerDirective,
  MenuContentDirective,
  MenuItemComponent,
  MenuLabelComponent,
  MenuSeparatorComponent,
  MenuShortcutComponent,
  MenuSurfaceComponent,
} from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-context-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShellComponent,
    ContextMenuTriggerDirective,
    MenuContentDirective,
    MenuItemComponent,
    MenuLabelComponent,
    MenuSeparatorComponent,
    MenuShortcutComponent,
    MenuSurfaceComponent,
  ],
  template: `
    <demo-page-shell
      title="Context Menu"
      description="Right-click menu with keyboard, focus, and CDK overlay positioning.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <div
          [uiContextMenuTrigger]="menu"
          class="flex h-40 w-full max-w-md items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground select-none">
          Right-click here
        </div>
        <ng-template uiMenuContent #menu="uiMenuContent">
          <ui-menu-surface>
            <ui-menu-label>Actions</ui-menu-label>
            <button ui-menu-item>Back <span ui-menu-shortcut>⌘[</span></button>
            <button ui-menu-item>Forward <span ui-menu-shortcut>⌘]</span></button>
            <ui-menu-separator />
            <button ui-menu-item>Reload</button>
            <button ui-menu-item [disabled]="true">View Page Source</button>
          </ui-menu-surface>
        </ng-template>
      </section>
    </demo-page-shell>
  `,
})
export class ContextMenuPageComponent {}
