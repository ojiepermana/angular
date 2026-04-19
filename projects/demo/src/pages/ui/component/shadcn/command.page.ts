import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CommandComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandInputComponent,
  CommandItemComponent,
  CommandListComponent,
  CommandSeparatorComponent,
  CommandShortcutComponent,
} from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-command-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ShellLayoutComponent,
    CommandComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandInputComponent,
    CommandItemComponent,
    CommandListComponent,
    CommandSeparatorComponent,
    CommandShortcutComponent,
  ],
  template: `
    <ui-shell title="Command" description="Fast filterable command palette primitive.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <ui-command class="w-full max-w-md rounded-lg border border-border shadow-md">
          <input ui-command-input placeholder="Type a command or search…" />
          <ui-command-list>
            <ui-command-empty>No results found.</ui-command-empty>
            <ui-command-group heading="Suggestions">
              <button ui-command-item>Calendar <span ui-command-shortcut>⌘K</span></button>
              <button ui-command-item>Search Emoji</button>
              <button ui-command-item>Calculator</button>
            </ui-command-group>
            <ui-command-separator />
            <ui-command-group heading="Settings">
              <button ui-command-item>Profile <span ui-command-shortcut>⌘P</span></button>
              <button ui-command-item>Billing</button>
              <button ui-command-item>Logout</button>
            </ui-command-group>
          </ui-command-list>
        </ui-command>
      </section>
    </ui-shell>
  `,
})
export class CommandPageComponent {}
