export interface TodoItem {
    id: string;
    title: string;
    note?: string | null;
    createdAt: string;
    completedAt: string | null;
    favorite: boolean;
}
