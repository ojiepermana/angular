import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  // Signal untuk menyimpan currently active navigation item ID
  private _activeItemId = signal<string | null>(null);

  // Signal untuk menyimpan expanded collapsable items
  private _expandedItems = signal<Set<string>>(new Set());

  // Getter untuk active item ID
  get activeItemId() {
    return this._activeItemId.asReadonly();
  }

  // Getter untuk expanded items
  get expandedItems() {
    return this._expandedItems.asReadonly();
  }

  // Set active item
  setActiveItem(itemId: string | null): void {
    this._activeItemId.set(itemId);
  }

  // Check if item is active
  isItemActive(itemId: string): boolean {
    return this._activeItemId() === itemId;
  }

  // Toggle expanded state for collapsable items
  toggleExpanded(itemId: string): void {
    this._expandedItems.update(expandedSet => {
      const newSet: Set<string> = new Set(expandedSet);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }

  // Check if item is expanded
  isItemExpanded(itemId: string): boolean {
    return this._expandedItems().has(itemId);
  }

  // Collapse all items (useful for mobile/responsive)
  collapseAll(): void {
    this._expandedItems.set(new Set());
  }

  // Expand specific item and optionally collapse others at same level
  expandItem(itemId: string, collapseOthers: boolean = false): void {
    this._expandedItems.update(expandedSet => {
      const newSet: Set<string> = collapseOthers ? new Set() : new Set(expandedSet);
      newSet.add(itemId);
      return newSet;
    });
  }

  // Clear all states (useful for navigation reset)
  clearAllStates(): void {
    this._activeItemId.set(null);
    this._expandedItems.set(new Set());
  }
}
