import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'footer-layout',
  imports: [],
  template: `
     <footer class="p-4 border-t border-slate-200 dark:border-slate-700 ">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">@ojiepermana/angular © 2025</span>
            <span class="text-slate-500 dark:text-slate-500">
              Built with ❤️ by Ojie Permana
            </span>
          </div>
        </footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterLayout {

}
