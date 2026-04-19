import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ButtonComponent,
  SheetComponent,
  SheetDescriptionComponent,
  SheetFooterComponent,
  SheetHeaderComponent,
  SheetTitleComponent,
} from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-sheet-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ShellLayoutComponent,
    ButtonComponent,
    SheetComponent,
    SheetDescriptionComponent,
    SheetFooterComponent,
    SheetHeaderComponent,
    SheetTitleComponent,
  ],
  template: `
    <ui-shell title="Sheet" description="Side drawer backed by CDK overlay — supports 4 sides.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <div class="flex flex-wrap items-center gap-2">
          <button ui-button variant="outline" (click)="openRight.set(true)">Right</button>
          <button ui-button variant="outline" (click)="openLeft.set(true)">Left</button>
          <button ui-button variant="outline" (click)="openTop.set(true)">Top</button>
          <button ui-button variant="outline" (click)="openBottom.set(true)">Bottom</button>
        </div>

        <ui-sheet [(open)]="openRight" side="right">
          <ui-sheet-header>
            <ui-sheet-title>Edit profile</ui-sheet-title>
            <ui-sheet-description>Make changes to your profile here.</ui-sheet-description>
          </ui-sheet-header>
          <ui-sheet-footer>
            <button ui-button (click)="openRight.set(false)">Done</button>
          </ui-sheet-footer>
        </ui-sheet>

        <ui-sheet [(open)]="openLeft" side="left">
          <ui-sheet-header>
            <ui-sheet-title>Left sheet</ui-sheet-title>
          </ui-sheet-header>
        </ui-sheet>

        <ui-sheet [(open)]="openTop" side="top">
          <ui-sheet-header>
            <ui-sheet-title>Top sheet</ui-sheet-title>
          </ui-sheet-header>
        </ui-sheet>

        <ui-sheet [(open)]="openBottom" side="bottom">
          <ui-sheet-header>
            <ui-sheet-title>Bottom sheet</ui-sheet-title>
          </ui-sheet-header>
        </ui-sheet>
      </section>
    </ui-shell>
  `,
})
export class SheetPageComponent {
  protected readonly openRight = signal(false);
  protected readonly openLeft = signal(false);
  protected readonly openTop = signal(false);
  protected readonly openBottom = signal(false);
}
