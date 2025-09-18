import { Component } from '@angular/core';
import { OpButton } from '../../projects/kit/src/lib/components/button';

@Component({
  selector: 'app-example',
  imports: [OpButton],
  template: `
    <section>
      <h2>Button Variants & Theme Demo</h2>
      <div>
        <op-button variant="primary" size="md">Primary Button</op-button>
        <op-button variant="secondary" size="md">Secondary Button</op-button>
        <op-button variant="destructive" size="md">Destructive Button</op-button>
      </div>
    </section>
  `,
  styles: `
    section {
      padding: 2rem;
    }
    div {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
  `
})
export class ExampleComponent {
}
