import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutService } from '../services/layout.service';

// Layout Components
import { Layout as EmptyLayout } from './types/empty';
import { Layout as DefaultLayout } from './types/default';
import { Layout as ModernLayout } from './types/modern';

@Component({
  selector: 'app-layout',
  imports: [EmptyLayout, DefaultLayout, ModernLayout],
  template: `
    @switch (layoutService.currentLayout()) {
      @case ('empty') {
        <layout-empty />
      }
      @case ('default') {
        <layout-default />
      }
      @case ('modern') {
        <layout-modern />
      }
      @default {
        <layout-default />
      }
    }
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {
  readonly layoutService = inject(LayoutService);
}
