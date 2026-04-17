import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { UiNavIconComponent } from './nav-icon.component';
import { NavigationService } from '../../core/services/navigation.service';
import { cn } from '../../core/utils/cn.util';
import type {
  NavigationAsideItem,
  NavigationBasicItem,
  NavigationCollapsableItem,
  NavigationGroupItem,
  NavigationItem,
  NavigationMegaItem,
} from '../../core/types/navigation.type';

/**
 * Recursive navigation item renderer (vertical context).
 *
 * Menerima item polymorphic dan delegasi ke template sesuai `type`.
 * Mega dirender sebagai group biasa saat muncul di konteks vertical.
 */
@Component({
  selector: 'ui-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatTooltip, UiNavIconComponent],
  template: `
    @switch (type()) {
      @case ('divider') {
        <hr class="my-2 border-t border-border" role="separator" />
      }
      @case ('spacer') {
        <div class="flex-1"></div>
      }
      @case ('group') {
        <div class="mt-4 first:mt-0" role="group" [attr.aria-labelledby]="headingId()">
          @if (!compact()) {
            <div class="px-3 pb-1">
              <div
                [id]="headingId()"
                [class]="cn('text-xs font-semibold uppercase tracking-wider text-muted-foreground', item().classes?.title)"
              >
                {{ item().title }}
              </div>
              @if (groupItem().subtitle) {
                <div [class]="cn('text-xs text-muted-foreground/80', item().classes?.subtitle)">
                  {{ groupItem().subtitle }}
                </div>
              }
            </div>
          }
          <div class="flex flex-col gap-0.5">
            @for (child of groupItem().children; track child.id) {
              <ui-nav-item [item]="child" [level]="level() + 1" [compact]="compact()" />
            }
          </div>
        </div>
      }
      @case ('collapsable') {
        @let id = collapsableItem().id ?? '';
        @let open = isGroupOpen();
        <button
          type="button"
          [class]="cn('group/ni flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', isTrailActive() && 'bg-accent/50', item().classes?.wrapper)"
          [attr.aria-expanded]="open"
          [attr.aria-controls]="id + '-panel'"
          [disabled]="collapsableItem().disabled || null"
          [matTooltip]="compact() ? (collapsableItem().title ?? '') : ''"
          matTooltipPosition="right"
          [matTooltipDisabled]="!compact()"
          (click)="toggleGroup()"
        >
          @if (collapsableItem().icon) {
            <ui-nav-icon
              [name]="collapsableItem().icon!"
              [class]="cn('text-xl', item().classes?.icon)"
            />
          }
          @if (!compact()) {
            <span [class]="cn('flex-1 truncate text-left', item().classes?.title)">
              {{ collapsableItem().title }}
            </span>
            @if (collapsableItem().badge; as badge) {
              <span [class]="badge.classes ?? 'ml-auto text-xs'">{{ badge.title }}</span>
            }
            <ui-nav-icon
              [name]="'chevron_right'"
              [class]="cn('text-base transition-transform duration-200', open && 'rotate-90')"
            />
          }
        </button>
        @if (!compact() && open) {
          <div
            [id]="id + '-panel'"
            role="region"
            class="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3"
          >
            @for (child of collapsableItem().children; track child.id) {
              <ui-nav-item [item]="child" [level]="level() + 1" [compact]="false" />
            }
          </div>
        }
      }
      @case ('mega') {
        <!-- Mega direndahkan ke group saat berada di sidebar vertical. -->
        <div class="mt-4 first:mt-0" role="group">
          @if (!compact()) {
            <div
              class="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {{ item().title }}
            </div>
          }
          <div class="flex flex-col gap-0.5">
            @for (child of megaItem().children; track child.id) {
              <ui-nav-item [item]="child" [level]="level() + 1" [compact]="compact()" />
            }
          </div>
        </div>
      }
      @case ('aside') {
        <a
          [class]="cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', item().classes?.wrapper)"
          routerLinkActive="bg-accent text-accent-foreground"
          #rla="routerLinkActive"
          [attr.aria-current]="rla.isActive ? 'page' : null"
          [routerLink]="asideItem().link"
          [queryParams]="asideItem().queryParams"
          [fragment]="asideItem().fragment ?? undefined"
          [target]="asideItem().target ?? undefined"
          [matTooltip]="compact() ? (asideItem().title ?? '') : ''"
          matTooltipPosition="right"
          [matTooltipDisabled]="!compact()"
        >
          @if (asideItem().icon) {
            <ui-nav-icon [name]="asideItem().icon!" class="text-xl" />
          }
          @if (!compact()) {
            <span class="flex-1 truncate">{{ asideItem().title }}</span>
          }
        </a>
      }
      @default {
        <!-- basic -->
        @if (basicItem().link && !basicItem().externalLink) {
          <a
            [class]="cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50', item().classes?.wrapper)"
            routerLinkActive="bg-accent text-accent-foreground"
            #rla="routerLinkActive"
            [routerLinkActiveOptions]="
              basicItem().isActiveMatchOptions ??
              (basicItem().exactMatch ? exactMatch : inexactMatch)
            "
            [attr.aria-current]="rla.isActive ? 'page' : null"
            [attr.aria-disabled]="basicItem().disabled || null"
            [matTooltip]="compact() ? (basicItem().title ?? '') : ''"
            matTooltipPosition="right"
            [matTooltipDisabled]="!compact()"
            [routerLink]="basicItem().link"
            [queryParams]="basicItem().queryParams"
            [queryParamsHandling]="basicItem().queryParamsHandling ?? null"
            [fragment]="basicItem().fragment ?? undefined"
            [preserveFragment]="basicItem().preserveFragment ?? false"
            [target]="basicItem().target ?? undefined"
            (click)="runAction()"
          >
            @if (basicItem().icon) {
              <ui-nav-icon
                [name]="basicItem().icon!"
                [class]="cn('text-xl', item().classes?.icon)"
              />
            }
            @if (!compact()) {
              <span [class]="cn('flex-1 truncate', item().classes?.title)">{{
                basicItem().title
              }}</span>
              @if (basicItem().badge; as badge) {
                <span [class]="badge.classes ?? 'ml-auto text-xs'">{{ badge.title }}</span>
              }
            }
          </a>
        } @else if (basicItem().link && basicItem().externalLink) {
          <a
            [class]="cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', item().classes?.wrapper)"
            [attr.href]="basicItem().link"
            [attr.target]="basicItem().target ?? '_blank'"
            rel="noopener noreferrer"
            [matTooltip]="compact() ? (basicItem().title ?? '') : ''"
            matTooltipPosition="right"
            [matTooltipDisabled]="!compact()"
          >
            @if (basicItem().icon) {
              <ui-nav-icon [name]="basicItem().icon!" class="text-xl" />
            }
            @if (!compact()) {
              <span class="flex-1 truncate">{{ basicItem().title }}</span>
            }
          </a>
        } @else {
          <button
            type="button"
            [class]="cn('flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', item().classes?.wrapper)"
            [disabled]="basicItem().disabled || null"
            [matTooltip]="compact() ? (basicItem().title ?? '') : ''"
            matTooltipPosition="right"
            [matTooltipDisabled]="!compact()"
            (click)="runAction()"
          >
            @if (basicItem().icon) {
              <ui-nav-icon [name]="basicItem().icon!" class="text-xl" />
            }
            @if (!compact()) {
              <span class="flex-1 truncate">{{ basicItem().title }}</span>
            }
          </button>
        }
      }
    }
  `,
})
export class UiNavItemComponent {
  private readonly nav = inject(NavigationService);
  protected readonly cn = cn;

  readonly item = input.required<NavigationItem>();
  readonly level = input<number>(0);
  /** Compact / icon-only rendering (sidebar `thin`). */
  readonly compact = input<boolean>(false);

  protected readonly exactMatch = {
    exact: true,
    paths: 'exact',
    queryParams: 'exact',
    fragment: 'exact',
    matrixParams: 'exact',
  } as const;
  protected readonly inexactMatch = {
    paths: 'subset',
    queryParams: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
  } as const;

  protected readonly type = computed(() => this.item().type);

  protected readonly groupItem = computed(() => this.item() as NavigationGroupItem);
  protected readonly collapsableItem = computed(() => this.item() as NavigationCollapsableItem);
  protected readonly megaItem = computed(() => this.item() as NavigationMegaItem);
  protected readonly asideItem = computed(() => this.item() as NavigationAsideItem);
  protected readonly basicItem = computed(() => this.item() as NavigationBasicItem);

  protected readonly headingId = computed(() => {
    const id = this.item().id ?? '';
    return `nav-group-${id}`;
  });

  protected isGroupOpen(): boolean {
    const id = this.item().id;
    if (!id) return false;
    // auto-open when any descendant is active
    if (this.nav.isActive(id) && 'children' in this.item()) return true;
    return this.nav.isGroupOpen(id);
  }

  protected isTrailActive(): boolean {
    return this.nav.isActive(this.item().id);
  }

  protected toggleGroup(): void {
    const id = this.item().id;
    if (id) this.nav.toggleGroup(id);
  }

  protected runAction(): void {
    const item = this.item();
    if ('action' in item && typeof item.action === 'function') {
      item.action(item);
    }
  }
}
