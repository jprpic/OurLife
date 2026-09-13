export type ShoppingCategoryId = 'groceries' | 'hygiene' | 'hardware' | 'car' | 'online';

export interface ShoppingItem {
    id: string;
    title: string;
    categoryId: ShoppingCategoryId;
    checked: boolean;
    createdAt: string;
}

export interface ShoppingCategory {
    id: ShoppingCategoryId;
    label: string;
    subtitle: string;
}

export const shoppingCategories: ShoppingCategory[] = [
    { id: 'groceries', label: 'Groceries', subtitle: 'Supermarket' },
    { id: 'hygiene', label: 'Hygiene', subtitle: 'DM / Müller' },
    { id: 'hardware', label: 'Hardware', subtitle: 'Home improvement / DIY' },
    { id: 'car', label: 'Car', subtitle: 'Auto supplies' },
    { id: 'online', label: 'Online', subtitle: 'E-commerce / Deliveries' },
];
