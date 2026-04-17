import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarComponent, AvatarFallbackComponent, AvatarImageComponent } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-avatar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, AvatarComponent, AvatarFallbackComponent, AvatarImageComponent],
  template: `
    <demo-page-shell title="Avatar" description="User image with graceful fallback when the image fails to load.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <div class="flex items-center gap-4">
          <ui-avatar>
            <ui-avatar-image src="https://github.com/shadcn.png" alt="@shadcn" />
            <ui-avatar-fallback>CN</ui-avatar-fallback>
          </ui-avatar>
          <ui-avatar>
            <ui-avatar-image src="https://broken.example/404.png" alt="fallback" />
            <ui-avatar-fallback>JD</ui-avatar-fallback>
          </ui-avatar>
          <ui-avatar class="h-14 w-14">
            <ui-avatar-fallback>OP</ui-avatar-fallback>
          </ui-avatar>
        </div>
      </section>
    </demo-page-shell>
  `,
})
export class AvatarPageComponent {}
