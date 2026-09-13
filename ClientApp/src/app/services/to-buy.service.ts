import { Injectable } from '@angular/core';
import { createStore, get, set } from 'idb-keyval';

import { ShoppingCategoryId, ShoppingItem } from '../models/shopping.model';

const toBuyStore = createStore('our-life-to-buy-db', 'to-buy-store');
const toBuyKey = 'shopping-items';

@Injectable({ providedIn: 'root' })
export class ToBuyService {
    private readonly hasIndexedDb = typeof indexedDB !== 'undefined';

    async getItems(): Promise<ShoppingItem[]> {
        if (!this.hasIndexedDb) {
            return [];
        }

        const items = await get<ShoppingItem[]>(toBuyKey, toBuyStore);
        return items ?? [];
    }

    async addItem(title: string, categoryId: ShoppingCategoryId): Promise<ShoppingItem[]> {
        const trimmed = title.trim();
        if (!trimmed) {
            return this.getItems();
        }

        const items = await this.getItems();
        const item: ShoppingItem = {
            id: crypto.randomUUID(),
            title: trimmed,
            categoryId,
            checked: false,
            createdAt: new Date().toISOString(),
        };

        return this.saveItems([item, ...items]);
    }

    async toggleChecked(id: string): Promise<ShoppingItem[]> {
        const items = await this.getItems();
        const updated = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
        return this.saveItems(updated);
    }

    async clearChecked(): Promise<ShoppingItem[]> {
        const items = await this.getItems();
        const remaining = items.filter((item) => !item.checked);
        return this.saveItems(remaining);
    }

    private async saveItems(items: ShoppingItem[]): Promise<ShoppingItem[]> {
        if (!this.hasIndexedDb) {
            return items;
        }

        await set(toBuyKey, items, toBuyStore);
        return items;
    }
}
