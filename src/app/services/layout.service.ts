import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

export type LayoutType = 'empty' | 'default' | 'modern';

export interface LayoutConfig {
  title?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly router = inject(Router);
  private readonly STORAGE_KEY = 'theme-layout';

  private readonly layoutConfigs: Record<LayoutType, LayoutConfig> = {
    empty: {
      title: '',
      showHeader: false,
      showSidebar: false,
      showFooter: false
    },
    default: {
      title: 'Dashboard',
      showHeader: true,
      showSidebar: true,
      showFooter: false
    },
    modern: {
      title: 'Modern App',
      showHeader: true,
      showSidebar: false,
      showFooter: true
    }
  };

  private getInitialLayout(): LayoutType {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY) as LayoutType;
      if (stored && ['empty', 'default', 'modern'].includes(stored)) {
        return stored;
      }
    }
    return 'default';
  }

  private readonly _currentLayout = signal<LayoutType>(this.getInitialLayout());
  private readonly _layoutConfig = signal<LayoutConfig>(
    this.layoutConfigs[this.getInitialLayout()]
  );

  readonly currentLayout = this._currentLayout.asReadonly();
  readonly layoutConfig = this._layoutConfig.asReadonly();

  readonly isEmptyLayout = computed(() => this._currentLayout() === 'empty');
  readonly isDefaultLayout = computed(() => this._currentLayout() === 'default');
  readonly isModernLayout = computed(() => this._currentLayout() === 'modern');

  readonly showHeader = computed(() => this._layoutConfig().showHeader ?? false);
  readonly showSidebar = computed(() => this._layoutConfig().showSidebar ?? false);
  readonly showFooter = computed(() => this._layoutConfig().showFooter ?? false);

  setLayout(layoutType: LayoutType): void {
    const config = this.layoutConfigs[layoutType];
    if (config) {
      this._currentLayout.set(layoutType);
      this._layoutConfig.set(config);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, layoutType);
      }
    } else {
      console.warn(`Layout type "${layoutType}" not found. Using default layout.`);
      this.setLayout('default');
    }
  }

  updateLayoutConfig(config: Partial<LayoutConfig>): void {
    this._layoutConfig.update(current => ({
      ...current,
      ...config
    }));
  }

  getLayoutConfig(layoutType: LayoutType): LayoutConfig {
    return this.layoutConfigs[layoutType];
  }

  getAvailableLayouts(): LayoutType[] {
    return Object.keys(this.layoutConfigs) as LayoutType[];
  }

  setLayoutForRoute(route: string): void {
    const routeLayoutMap: Record<string, LayoutType> = {
      '/auth': 'empty',
      '/login': 'empty',
      '/register': 'empty',
      '/': 'default',
      '/dashboard': 'default',
      '/demo': 'modern',
      '/website': 'modern'
    };

    const layoutType = routeLayoutMap[route] || 'default';
    this.setLayout(layoutType);
  }

  getCurrentLayoutSelector(): string {
    const layoutType = this._currentLayout();
    return `layout-${layoutType}`;
  }

  resetToDefault(): void {
    this.setLayout('default');
  }

  clearStoredLayout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.setLayout('default');
  }
}
