import { ChangeDetectionStrategy, Component, computed, inject, input, output, viewChild } from '@angular/core';
import {
  AvatarComponent,
  AvatarFallbackComponent,
  AvatarImageComponent,
  ButtonComponent,
  PopoverContentDirective,
  PopoverTriggerDirective,
  cn,
  type PopoverAlign,
  type PopoverSide,
} from '@ojiepermana/angular/component';
import { LayoutService, type LayoutMode, type LayoutWidth } from '@ojiepermana/angular/layout';
import { UiNavIconComponent } from '@ojiepermana/angular/navigation';
import { ThemeService, type ColorScheme } from '@ojiepermana/angular/theme';

interface ToggleOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly icon: string;
}

export type EtosThemeSwitcherAction = string;

export interface EtosThemeSwitcherUserInfo {
  readonly name: string;
  readonly subtitle?: string;
  readonly avatarSrc?: string | null;
  readonly avatarAlt?: string;
}

export interface EtosThemeSwitcherNotificationShortcut {
  readonly value?: EtosThemeSwitcherAction;
  readonly icon?: string;
  readonly ariaLabel?: string;
}

type EtosThemeSwitcherActionTone = 'default' | 'destructive';

export interface EtosThemeSwitcherQuickAction {
  readonly value: EtosThemeSwitcherAction;
  readonly label: string;
  readonly icon: string;
  readonly tone?: EtosThemeSwitcherActionTone;
}

const THEME_SCHEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'System', icon: 'computer' },
] as const satisfies readonly ToggleOption<ColorScheme>[];

const LAYOUT_MODE_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal', icon: 'view_column' },
  { value: 'vertical', label: 'Vertical', icon: 'view_sidebar' },
] as const satisfies readonly ToggleOption<LayoutMode>[];

const LAYOUT_WIDTH_OPTIONS = [
  { value: 'full', label: 'Full', icon: 'fit_screen' },
  { value: 'fixed', label: 'Fixed', icon: 'center_focus_strong' },
] as const satisfies readonly ToggleOption<LayoutWidth>[];

@Component({
  selector: 'etos-theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    AvatarFallbackComponent,
    AvatarImageComponent,
    ButtonComponent,
    PopoverContentDirective,
    PopoverTriggerDirective,
    UiNavIconComponent,
  ],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    @if (notificationShortcutConfig(); as shortcut) {
      <button
        type="button"
        ui-button
        variant="ghost"
        size="icon"
        data-trigger-action="notifications"
        [attr.data-value]="shortcut.value"
        [attr.aria-label]="shortcut.ariaLabel"
        [class]="notificationButtonClasses()"
        (click)="triggerNotificationAction($event)">
        <ui-nav-icon [name]="shortcut.icon" [size]="18" class="text-current" />
      </button>
    }

    <button
      #trigger="uiPopoverTrigger"
      type="button"
      ui-button
      variant="ghost"
      size="icon"
      [uiPopoverTrigger]="preferencesPanel"
      [side]="popoverSide()"
      [align]="popoverAlign()"
      [attr.aria-label]="triggerLabel()"
      [class]="triggerButtonClasses(trigger.isOpen())">
      <ui-avatar class="h-8 w-8 border border-border/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
        @if (hasAvatar()) {
          <ui-avatar-image [src]="avatarImageSrc()" [alt]="avatarAltText()" />
        }
        <ui-avatar-fallback class="bg-primary text-xs font-semibold tracking-[0.24em] text-primary-foreground">
          {{ initials() }}
        </ui-avatar-fallback>
      </ui-avatar>
    </button>

    <ng-template uiPopoverContent #preferencesPanel="uiPopoverContent">
      <section
        data-etos-theme-switcher-panel
        role="dialog"
        aria-label="User Info"
        class="w-[min(21rem,calc(100vw-1.5rem))] overflow-hidden rounded-(--etos-layout-frame-radius) border border-border/70 bg-background text-foreground shadow-[0_18px_48px_rgba(15,23,42,0.12)]">
        <header class="p-5 pb-4">
          <div class="flex items-center gap-4">
            <ui-avatar class="h-14 w-14 border border-border/60 shadow-sm">
              @if (hasAvatar()) {
                <ui-avatar-image [src]="avatarImageSrc()" [alt]="avatarAltText()" />
              }
              <ui-avatar-fallback class="bg-primary text-sm font-semibold tracking-[0.24em] text-primary-foreground">
                {{ initials() }}
              </ui-avatar-fallback>
            </ui-avatar>

            <div class="min-w-0 flex min-h-14 flex-1 flex-col justify-center self-center">
              <div class="space-y-px">
                <h2 class="truncate text-[1.1rem] font-semibold leading-none tracking-tight text-foreground">
                  {{ resolvedUserName() }}
                </h2>
                <p class="text-sm leading-[0.95rem] text-muted-foreground">
                  {{ resolvedUserSubtitle() }}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div class="space-y-4 px-5 pb-5">
          <section
            data-setting="theme-scheme"
            [attr.data-current]="themeScheme()"
            class="rounded-(--etos-layout-frame-radius) bg-muted/65 p-0.5">
            <div class="grid grid-cols-3 gap-1">
              @for (option of themeSchemeOptions; track option.value) {
                <button
                  type="button"
                  ui-button
                  size="sm"
                  variant="ghost"
                  [class]="themeOptionClasses(themeScheme() === option.value)"
                  data-setting-option="theme-scheme"
                  [attr.data-value]="option.value"
                  (click)="setThemeScheme(option.value)">
                  <span class="inline-flex items-center gap-2.5">
                    <ui-nav-icon
                      [name]="option.icon"
                      [size]="18"
                      [class]="themeIconClasses(themeScheme() === option.value)" />
                    <span class="text-sm font-semibold leading-none">{{ option.label }}</span>
                  </span>
                </button>
              }
            </div>
          </section>

          <section data-setting="layout-mode" [attr.data-current]="layoutMode()" class="space-y-2">
            <div class="px-1">
              <p class="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Layout</p>
            </div>
            <div class="rounded-(--etos-layout-frame-radius) bg-muted/65 p-0.5">
              <div class="grid grid-cols-2 gap-1">
                @for (option of layoutModeOptions; track option.value) {
                  <button
                    type="button"
                    ui-button
                    size="sm"
                    variant="ghost"
                    [class]="segmentedOptionClasses(layoutMode() === option.value)"
                    data-setting-option="layout-mode"
                    [attr.data-value]="option.value"
                    (click)="setLayoutMode(option.value)">
                    <span class="inline-flex items-center gap-2.5">
                      <ui-nav-icon
                        [name]="option.icon"
                        [size]="18"
                        [class]="themeIconClasses(layoutMode() === option.value)" />
                      <span class="text-sm font-semibold leading-none">{{ option.label }}</span>
                    </span>
                  </button>
                }
              </div>
            </div>
          </section>

          <section data-setting="layout-width" [attr.data-current]="layoutWidth()" class="space-y-2">
            <div class="px-1">
              <p class="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Width</p>
            </div>
            <div class="rounded-(--etos-layout-frame-radius) bg-muted/65 p-0.5">
              <div class="grid grid-cols-2 gap-1">
                @for (option of layoutWidthOptions; track option.value) {
                  <button
                    type="button"
                    ui-button
                    size="sm"
                    variant="ghost"
                    [class]="segmentedOptionClasses(layoutWidth() === option.value)"
                    data-setting-option="layout-width"
                    [attr.data-value]="option.value"
                    (click)="setLayoutWidth(option.value)">
                    <span class="inline-flex items-center gap-2.5">
                      <ui-nav-icon
                        [name]="option.icon"
                        [size]="18"
                        [class]="themeIconClasses(layoutWidth() === option.value)" />
                      <span class="text-sm font-semibold leading-none">{{ option.label }}</span>
                    </span>
                  </button>
                }
              </div>
            </div>
          </section>

          <section class="space-y-1 border-t border-border/70 pt-2">
            <h3 class="sr-only">Quick Actions</h3>
            <div class="grid gap-1">
              @for (action of actionOptions(); track action.value) {
                <button
                  type="button"
                  ui-button
                  variant="ghost"
                  [class]="actionButtonClasses(action.tone ?? 'default')"
                  data-action-option
                  [attr.data-value]="action.value"
                  (click)="triggerAction(action.value)">
                  <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/65">
                    <ui-nav-icon
                      [name]="action.icon"
                      [size]="19"
                      [class]="actionIconClasses(action.tone ?? 'default')" />
                  </span>
                  <span [class]="actionLabelClasses(action.tone ?? 'default')">
                    {{ action.label }}
                  </span>
                </button>
              }
            </div>
          </section>
        </div>
      </section>
    </ng-template>
  `,
})
export class EtosThemeSwitcherComponent {
  private readonly theme = inject(ThemeService);
  private readonly layout = inject(LayoutService);
  private readonly popoverTrigger = viewChild.required<PopoverTriggerDirective>('trigger');

  readonly class = input<string>('');
  readonly userInfo = input<EtosThemeSwitcherUserInfo | null>(null);
  readonly userName = input<string>('User');
  readonly userSubtitle = input<string>('Theme and layout preferences');
  readonly avatarSrc = input<string | null>(null);
  readonly avatarAlt = input<string>('');
  readonly quickActions = input.required<readonly EtosThemeSwitcherQuickAction[]>();
  readonly notificationShortcut = input<EtosThemeSwitcherNotificationShortcut | null>(null);
  readonly showNotificationShortcut = input<boolean>(false);
  readonly popoverSide = input<PopoverSide>('bottom');
  readonly popoverAlign = input<PopoverAlign>('end');
  readonly actionSelected = output<EtosThemeSwitcherAction>();

  protected readonly themeMode = this.theme.mode;
  protected readonly themeScheme = this.theme.scheme;
  protected readonly layoutMode = this.layout.mode;
  protected readonly layoutWidth = this.layout.width;

  protected readonly themeSchemeOptions = THEME_SCHEME_OPTIONS;
  protected readonly layoutModeOptions = LAYOUT_MODE_OPTIONS;
  protected readonly layoutWidthOptions = LAYOUT_WIDTH_OPTIONS;
  protected readonly notificationShortcutConfig = computed<Required<EtosThemeSwitcherNotificationShortcut> | null>(
    () => {
      const shortcut = this.notificationShortcut();

      if (shortcut) {
        return {
          value: shortcut.value ?? 'notifications',
          icon: shortcut.icon ?? 'notifications',
          ariaLabel: shortcut.ariaLabel ?? `Open notifications for ${this.resolvedUserName()}`,
        };
      }

      if (!this.showNotificationShortcut()) {
        return null;
      }

      return {
        value: 'notifications',
        icon: 'notifications',
        ariaLabel: `Open notifications for ${this.resolvedUserName()}`,
      };
    },
  );
  protected readonly actionOptions = computed(() => {
    const shortcutValue = this.notificationShortcutConfig()?.value;

    if (!shortcutValue) {
      return this.quickActions();
    }

    return this.quickActions().filter((action) => action.value !== shortcutValue);
  });

  protected readonly hostClasses = computed(() => cn('inline-flex shrink-0 items-center gap-2', this.class()));
  protected readonly resolvedUserName = computed(() => this.userInfo()?.name?.trim() || this.userName());
  protected readonly resolvedUserSubtitle = computed(() => this.userInfo()?.subtitle ?? this.userSubtitle());
  protected readonly resolvedAvatarSrc = computed(() => this.userInfo()?.avatarSrc ?? this.avatarSrc());
  protected readonly resolvedAvatarAlt = computed(() => this.userInfo()?.avatarAlt ?? this.avatarAlt());
  protected readonly hasAvatar = computed(() => !!this.resolvedAvatarSrc());
  protected readonly avatarImageSrc = computed(() => this.resolvedAvatarSrc() ?? '');
  protected readonly avatarAltText = computed(() => this.resolvedAvatarAlt() || `${this.resolvedUserName()} avatar`);
  protected readonly initials = computed(() => this.toInitials(this.resolvedUserName()));
  protected readonly triggerLabel = computed(() => `Open user info for ${this.resolvedUserName()}`);

  protected triggerButtonClasses(open: boolean): string {
    return cn(
      'relative h-8 w-8 rounded-full p-0 transition-colors duration-150 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      open && 'bg-muted/50',
    );
  }

  protected notificationButtonClasses(): string {
    return cn(
      'h-8 w-8 rounded-[var(--etos-layout-frame-radius)] p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    );
  }

  protected segmentedOptionClasses(active: boolean): string {
    return cn(
      'h-10 rounded-[var(--etos-layout-frame-radius)] border border-transparent px-[0.3125rem] py-[0.1875rem] text-foreground transition-colors',
      active ? 'bg-background shadow-sm' : 'text-muted-foreground hover:bg-background/70',
    );
  }

  protected themeOptionClasses(active: boolean): string {
    return this.segmentedOptionClasses(active);
  }

  protected themeIconClasses(active: boolean): string {
    return active ? 'text-foreground' : 'text-muted-foreground';
  }

  protected actionButtonClasses(tone: EtosThemeSwitcherActionTone = 'default'): string {
    return cn(
      'h-12 w-full justify-start gap-2.5 rounded-[var(--etos-layout-frame-radius)] border border-transparent px-2 py-1.5 text-left transition-colors hover:bg-muted/50',
      tone === 'destructive' && 'hover:bg-destructive/8 focus-visible:ring-destructive/30',
    );
  }

  protected actionIconClasses(tone: EtosThemeSwitcherActionTone = 'default'): string {
    return tone === 'destructive' ? 'text-destructive' : 'text-foreground';
  }

  protected actionLabelClasses(tone: EtosThemeSwitcherActionTone = 'default'): string {
    return tone === 'destructive' ? 'text-sm font-medium text-destructive' : 'text-sm font-medium text-foreground';
  }

  protected setThemeScheme(mode: ColorScheme): void {
    this.theme.setScheme(mode);
  }

  protected setLayoutMode(mode: LayoutMode): void {
    this.layout.setMode(mode);
  }

  protected setLayoutWidth(width: LayoutWidth): void {
    this.layout.setWidth(width);
  }

  protected triggerAction(action: EtosThemeSwitcherAction): void {
    this.actionSelected.emit(action);
    this.popoverTrigger().close();
  }

  protected triggerNotificationAction(event: Event): void {
    event.stopPropagation();

    const shortcut = this.notificationShortcutConfig();

    if (!shortcut) {
      return;
    }

    this.actionSelected.emit(shortcut.value);
  }

  private labelForLayoutMode(mode: LayoutMode): string {
    return mode === 'horizontal' ? 'Horizontal' : 'Vertical';
  }

  private labelForLayoutWidth(width: LayoutWidth): string {
    return width === 'full' ? 'Full' : 'Fixed';
  }

  private toInitials(name: string): string {
    const segments = name.trim().split(/\s+/).filter(Boolean);

    if (segments.length === 0) {
      return 'UI';
    }

    if (segments.length === 1) {
      return segments[0].slice(0, 2).toUpperCase();
    }

    return `${segments[0][0] ?? ''}${segments[1][0] ?? ''}`.toUpperCase();
  }
}
