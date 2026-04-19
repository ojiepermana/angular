import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LayoutService } from '../core/layout.service';

/**
 * Page shell with projected header, main, and footer content.
 *
 * Markup:
 * ```html
 * <ui-shell>
 *   <div ui-shell-header class="contents">...</div>
 *   <div ui-shell-main class="contents">...</div>
 *   <div ui-shell-footer class="contents">...</div>
 * </ui-shell>
 * ```
 */
@Component({
  selector: 'ui-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex h-full min-h-0 flex-col bg-background text-foreground',
    '[attr.data-layout-mode]': 'layoutMode()',
    '[attr.title]': 'null',
    '[attr.description]': 'null',
  },
  template: `
    <header [class]="headerClasses()"><ng-content select="[ui-shell-header]" /></header>
    <main class="min-h-0 flex-1 overflow-auto">
      <section [class]="contentClasses()" [attr.data-shell-layout]="layoutMode()">
        <div [class]="pageHeaderClasses()">
          <div class="min-w-0 flex-1 space-y-3">
            @if (pageTitle()) {
              <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{{ pageTitle() }}</h1>
            }
            @if (pageDescription()) {
              <p class="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {{ pageDescription() }}
              </p>
            }
          </div>

          <div class="flex shrink-0 flex-wrap items-center gap-2">
            <ng-content select="[ui-shell-actions],[demo-page-actions]" />
          </div>
        </div>

        <div [class]="bodyClasses()">
          <ng-content select="[ui-shell-main],[ui-shell-content]" />
          <ng-content />
        </div>
      </section>
    </main>
    <footer [class]="footerClasses()"><ng-content select="[ui-shell-footer]" /></footer>
  `,
  styles: `
    header:empty,
    footer:empty {
      display: none;
    }
  `,
})
export class ShellLayoutComponent {
  private readonly layout = inject(LayoutService);

  readonly pageTitle = input<string>('', { alias: 'title' });
  readonly pageDescription = input<string>('', { alias: 'description' });
  readonly verticalHeaderClass = input<string>('flex h-12 shrink-0 items-center border-b border-border bg-card px-4');
  readonly horizontalHeaderClass = input<string>('flex shrink-0 items-center justify-between p-6');
  readonly verticalContentClass = input<string>('flex min-h-full flex-col');
  readonly horizontalContentClass = input<string>('flex min-h-full flex-col p-6');
  readonly verticalPageContentClass = input<string>(
    'mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8',
  );
  readonly horizontalPageContentClass = input<string>(
    'mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8',
  );
  readonly verticalFooterClass = input<string>('flex h-12 shrink-0 items-center border-t border-border bg-card px-4');
  readonly horizontalFooterClass = input<string>('flex h-12 shrink-0 items-center border-t border-border px-6');

  protected readonly layoutMode = this.layout.mode;
  protected readonly hasPageHeader = computed(() => Boolean(this.pageTitle() || this.pageDescription()));
  protected readonly headerClasses = computed(() =>
    this.layoutMode() === 'vertical' ? this.verticalHeaderClass() : this.horizontalHeaderClass(),
  );
  protected readonly pageHeaderClasses = computed(() =>
    this.hasPageHeader() ? 'flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between' : 'hidden',
  );
  protected readonly bodyClasses = computed(() => (this.hasPageHeader() ? 'flex flex-col gap-8' : 'contents'));
  protected readonly contentClasses = computed(() => {
    if (this.hasPageHeader()) {
      return this.layoutMode() === 'vertical' ? this.verticalPageContentClass() : this.horizontalPageContentClass();
    }

    return this.layoutMode() === 'vertical' ? this.verticalContentClass() : this.horizontalContentClass();
  });
  protected readonly footerClasses = computed(() =>
    this.layoutMode() === 'vertical' ? this.verticalFooterClass() : this.horizontalFooterClass(),
  );
}
