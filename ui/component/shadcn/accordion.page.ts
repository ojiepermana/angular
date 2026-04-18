import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AccordionComponent,
  AccordionContentComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
} from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-accordion-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShellComponent,
    AccordionComponent,
    AccordionContentComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
  ],
  template: `
    <demo-page-shell
      title="Accordion"
      description="Stacked, collapsible sections. Supports single and multiple open modes.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Single</h2>
        <ui-accordion type="single" class="w-full max-w-xl">
          <ui-accordion-item value="a">
            <button ui-accordion-trigger>Is it accessible?</button>
            <ui-accordion-content>Yes. Follows WAI-ARIA patterns.</ui-accordion-content>
          </ui-accordion-item>
          <ui-accordion-item value="b">
            <button ui-accordion-trigger>Is it styled?</button>
            <ui-accordion-content>Styled with shadcn tokens.</ui-accordion-content>
          </ui-accordion-item>
          <ui-accordion-item value="c">
            <button ui-accordion-trigger>Is it animated?</button>
            <ui-accordion-content>Yes — with reduced-motion fallback.</ui-accordion-content>
          </ui-accordion-item>
        </ui-accordion>
      </section>

      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Multiple</h2>
        <ui-accordion type="multiple" class="w-full max-w-xl">
          <ui-accordion-item value="a">
            <button ui-accordion-trigger>Item A</button>
            <ui-accordion-content>Both can be open at once.</ui-accordion-content>
          </ui-accordion-item>
          <ui-accordion-item value="b">
            <button ui-accordion-trigger>Item B</button>
            <ui-accordion-content>Click to toggle independently.</ui-accordion-content>
          </ui-accordion-item>
        </ui-accordion>
      </section>
    </demo-page-shell>
  `,
})
export class AccordionPageComponent {}
