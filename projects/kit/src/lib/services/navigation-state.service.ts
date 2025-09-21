import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  // Signals for active and expanded items
  private _activeItemId = signal<string | null>(null);
  private _expandedItems = signal<Set<string>>(new Set());

  // Public computed signals
  readonly activeItemId = computed(() => this._activeItemId());
  readonly expandedItems = computed(() => this._expandedItems());

  /**
   * Set the active navigation item
   */
  setActiveItem(itemId: string): void {
    this._activeItemId.set(itemId);
  }

  /**
   * Clear active item
   */
  clearActiveItem(): void {
    this._activeItemId.set(null);
  }

  /**
   * Check if an item is active
   */
  isItemActive(itemId: string): boolean {
    return this._activeItemId() === itemId;
  }

  /**
   * Toggle expanded state of an item
   */
  toggleExpanded(itemId: string): void {
    this._expandedItems.update(expanded => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return newExpanded;
    });
  }

  /**
   * Expand an item
   */
  expandItem(itemId: string): void {
    this._expandedItems.update(expanded => {
      const newExpanded = new Set(expanded);
      newExpanded.add(itemId);
      return newExpanded;
    });
  }

  /**
   * Collapse an item
   */
  collapseItem(itemId: string): void {
    this._expandedItems.update(expanded => {
      const newExpanded = new Set(expanded);
      newExpanded.delete(itemId);
      return newExpanded;
    });
  }

  /**
   * Check if an item is expanded
   */
  isItemExpanded(itemId: string): boolean {
    return this._expandedItems().has(itemId);
  }

  /**
   * Collapse all expanded items
   */
  collapseAll(): void {
    this._expandedItems.set(new Set());
  }

  /**
   * Reset all state
   */
  reset(): void {
    this._activeItemId.set(null);
    this._expandedItems.set(new Set());
  }
}
