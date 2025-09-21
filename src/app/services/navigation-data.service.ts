import { Injectable, signal } from '@angular/core';
import { NavigationItem } from '../../../projects/kit/src/lib/types/navigations.type';
import { demoNavigationData } from '../navigations';

@Injectable({
  providedIn: 'root'
})
export class NavigationDataService {
  // Signal untuk menyimpan data navigasi
  private _navigationData = signal<NavigationItem[]>(demoNavigationData);

  // Getter untuk mendapatkan data navigasi (readonly)
  get navigationData() {
    return this._navigationData.asReadonly();
  }

  // Method untuk update navigasi jika diperlukan
  updateNavigationData(newData: NavigationItem[]): void {
    this._navigationData.set(newData);
  }

  // Method untuk mendapatkan item navigasi berdasarkan ID
  getNavigationItem(id: string): NavigationItem | null {
    return this.findItemById(this._navigationData(), id);
  }

  // Method untuk mencari item dalam struktur nested
  private findItemById(items: NavigationItem[], id: string): NavigationItem | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = this.findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // Method untuk mendapatkan semua item dengan type tertentu
  getItemsByType(type: NavigationItem['type']): NavigationItem[] {
    return this.filterItemsByType(this._navigationData(), type);
  }

  private filterItemsByType(items: NavigationItem[], type: NavigationItem['type']): NavigationItem[] {
    const result: NavigationItem[] = [];
    for (const item of items) {
      if (item.type === type) {
        result.push(item);
      }
      if (item.children) {
        result.push(...this.filterItemsByType(item.children, type));
      }
    }
    return result;
  }

  // Method untuk mendapatkan breadcrumb path
  getBreadcrumbPath(targetId: string): NavigationItem[] {
    const path: NavigationItem[] = [];
    this.findPathToItem(this._navigationData(), targetId, path);
    return path;
  }

  private findPathToItem(items: NavigationItem[], targetId: string, path: NavigationItem[]): boolean {
    for (const item of items) {
      path.push(item);
      if (item.id === targetId) {
        return true;
      }
      if (item.children && this.findPathToItem(item.children, targetId, path)) {
        return true;
      }
      path.pop();
    }
    return false;
  }
}