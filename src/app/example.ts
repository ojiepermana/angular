import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../projects/kit/src/lib/components/button';

@Component({
  selector: 'app-example',
  imports: [Button, RouterLink],
  template: `
    <section>
      <h2>Button Variants & Theme Demo</h2>
      <div>
        <op-button variant="primary" size="md">Primary Button</op-button>
        <op-button variant="secondary" size="md">Secondary Button</op-button>
        <op-button variant="destructive" size="md">Destructive Button</op-button>
      </div>

      <div class="demo-links">
        <h3>Demo Pages</h3>
        <nav>
          <a routerLink="/demo/layout" class="demo-link">
            <op-button variant="outline" size="md">Layout Demo</op-button>
          </a>
          <a routerLink="/demo/themes" class="demo-link">
            <op-button variant="outline" size="md">Themes Demo</op-button>
          </a>
          <a routerLink="/demo/variables" class="demo-link">
            <op-button variant="outline" size="md">CSS Variables Demo</op-button>
          </a>
        </nav>
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
    .demo-links {
      margin-top: 2rem;
      flex-direction: column;
      gap: 1rem;
    }
    .demo-links h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }
    .demo-links nav {
      display: flex;
      gap: 1rem;
    }
    .demo-link {
      text-decoration: none;
    }
  `
})
export class ExampleComponent {
}
