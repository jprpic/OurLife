import { Component, computed, inject, signal } from '@angular/core';

import { ShoppingCategoryId, shoppingCategories, ShoppingItem } from '../../models/shopping.model';
import { ToBuyService } from '../../services/to-buy.service';

@Component({
    selector: 'app-to-buy-page',
    standalone: true,
    templateUrl: './to-buy-page.html',
    styleUrl: './to-buy-page.css',
})
export class ToBuyPageComponent {
    private readonly toBuyService = inject(ToBuyService);
    protected readonly shoppingCategories = shoppingCategories;
    protected readonly items = signal<ShoppingItem[]>([]);
    protected readonly draft = signal('');
    protected readonly categoryDraft = signal<ShoppingCategoryId>('groceries');
    protected readonly openDrawers = signal<Record<string, boolean>>({ groceries: true });

    protected readonly visibleCategories = computed(() =>
        shoppingCategories.filter((category) =>
            this.items().some((item) => item.categoryId === category.id),
        ),
    );

    constructor() {
        void this.loadItems();
    }

    protected itemsForCategory(categoryId: ShoppingCategoryId): ShoppingItem[] {
        return this.items()
            .filter((item) => item.categoryId === categoryId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    protected uncheckedCount(categoryId: ShoppingCategoryId): number {
        return this.itemsForCategory(categoryId).filter((item) => !item.checked).length;
    }

    protected isDrawerOpen(categoryId: ShoppingCategoryId): boolean {
        return !!this.openDrawers()[categoryId];
    }

    protected onGlobalAdd(): void {
        const value = this.draft().trim();
        if (!value) return;

        void this.toBuyService.addItem(value, this.categoryDraft()).then((items) => {
            this.items.set(items);
            this.draft.set('');
            this.openDrawers.update((current) => ({ ...current, [this.categoryDraft()]: true }));
        });
    }

    protected updateCategoryDraft(value: string): void {
        this.categoryDraft.set(value as ShoppingCategoryId);
    }

    protected toggleDrawer(categoryId: ShoppingCategoryId): void {
        this.openDrawers.update((current) => ({
            ...current,
            [categoryId]: !this.isDrawerOpen(categoryId),
        }));
    }

    protected async toggleItem(id: string): Promise<void> {
        this.items.set(await this.toBuyService.toggleChecked(id));
    }

    protected async clearChecked(): Promise<void> {
        this.items.set(await this.toBuyService.clearChecked());
    }

    private async loadItems(): Promise<void> {
        this.items.set(await this.toBuyService.getItems());
    }
}
