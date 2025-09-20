export type NavigationType = 'aside' | 'basic' | 'collapsable' | 'divider' | 'group' | 'spacer';

export interface NavigationBadge {
  title?: string;
  classes?: string;
}

export interface NavigationClasses {
  wrapper?: string;
  item?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export interface NavigationItem {
  id?: string;
  title?: string;
  subtitle?: string;
  type?: NavigationType;
  hidden?: boolean;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  link?: string;
  fragment?: string;
  preserveFragment?: boolean;
  queryParams?: any;
  queryParamsHandling?: string;
  externalLink?: boolean;
  target?: string;
  exactMatch?: boolean;
  isActiveMatchOptions?: any;
  function?: any;
  classes?: NavigationClasses;
  icon?: string;
  badge?: NavigationBadge;
  children?: NavigationItem[];
}
