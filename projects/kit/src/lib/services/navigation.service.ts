import { Injectable } from '@angular/core';
import { NavigationItem } from '../types/navigations.type';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _componentRegistry: Map<string, any> = new Map<string, any>();
    private _navigation: NavigationItem[] = [];

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register navigation component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: any): void {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister navigation component
     *
     * @param name
     */
    deregisterComponent(name: string): void {
        this._componentRegistry.delete(name);
    }

    /**
     * Get navigation component from the registry
     *
     * @param name
     */
    getComponent<T>(name: string): T {
        return this._componentRegistry.get(name);
    }

    /**
     * Store the given navigation
     *
     * @param navigation
     */
    storeNavigation(navigation: NavigationItem[]): void {
        this._navigation = navigation;
    }

    /**
     * Get navigation from storage
     *
     */
    getNavigation(): NavigationItem[] {
        return this._navigation;
    }

    /**
     * Delete the navigation from the storage
     */
    deleteNavigation(): void {
        if (!this._navigation.length) {
            console.warn('Navigation store is already empty.');
        }

        this._navigation = [];
    }

    /**
     * Utility function that returns a flattened
     * version of the given navigation array
     *
     * @param navigation
     * @param flatNavigation
     */
    getFlatNavigation(
        navigation: NavigationItem[],
        flatNavigation: NavigationItem[] = []
    ): NavigationItem[] {
        for (const item of navigation) {
            if (item.type === 'basic') {
                flatNavigation.push(item);
                continue;
            }

            if (
                item.type === 'aside' ||
                item.type === 'collapsable' ||
                item.type === 'group'
            ) {
                if (item.children) {
                    this.getFlatNavigation(item.children, flatNavigation);
                }
            }
        }

        return flatNavigation;
    }

    /**
     * Utility function that returns the item
     * with the given id from given navigation
     *
     * @param id
     * @param navigation
     */
    getItem(
        id: string,
        navigation: NavigationItem[]
    ): NavigationItem | null {
        for (const item of navigation) {
            if (item.id === id) {
                return item;
            }

            if (item.children) {
                const childItem = this.getItem(id, item.children);

                if (childItem) {
                    return childItem;
                }
            }
        }

        return null;
    }

    /**
     * Utility function that returns the item's parent
     * with the given id from given navigation
     *
     * @param id
     * @param navigation
     * @param parent
     */
    getItemParent(
        id: string,
        navigation: NavigationItem[],
        parent: NavigationItem[] | NavigationItem
    ): NavigationItem[] | NavigationItem | null {
        for (const item of navigation) {
            if (item.id === id) {
                return parent;
            }

            if (item.children) {
                const childItem = this.getItemParent(id, item.children, item);

                if (childItem) {
                    return childItem;
                }
            }
        }

        return null;
    }
}
