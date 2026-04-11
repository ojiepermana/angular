export type LayoutMode = 'vertical' | 'horizontal' | 'empty';
export type LayoutContainer = 'full' | 'boxed';

export interface NgLayoutConfig {
  defaultMode: LayoutMode;
  defaultContainer: LayoutContainer;
  /**
   * @deprecated Local storage keys are fixed and no longer configurable.
   */
  storageKey?: string;
  /**
   * @deprecated Local storage keys are fixed and no longer versioned.
   */
  storageVersion?: string;
}
