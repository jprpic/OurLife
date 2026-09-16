import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

import { TodoItem } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { TodoArchiveComponent } from '../todo-archive/todo-archive';
import { TodoListComponent } from '../todo-list/todo-list';

const DONE_THRESHOLD_MS = 5 * 60 * 1000;

export function isTodoDone(todo: Pick<TodoItem, 'completedAt'>, now: number = Date.now()): boolean {
    if (!todo.completedAt) return false;
    return now - new Date(todo.completedAt).getTime() >= DONE_THRESHOLD_MS;
}

export function isTodoActive(todo: Pick<TodoItem, 'completedAt'>, now: number = Date.now()): boolean {
    return !todo.completedAt || !isTodoDone(todo, now);
}

export function toggleFavorite<T extends Pick<TodoItem, 'favorite'>>(todo: T): T {
    return { ...todo, favorite: !todo.favorite };
}

export function toggleTodoCompletion<T extends Pick<TodoItem, 'completedAt' | 'favorite'>>(todo: T, isComplete: boolean, now: number = Date.now()): T {
    if (isComplete) {
        return {
            ...todo,
            completedAt: new Date().toISOString(),
        };
    }

    if (!todo.completedAt) {
        return todo;
    }

    return {
        ...todo,
        completedAt: null,
        favorite: isTodoDone(todo, now) ? false : todo.favorite,
    };
}

export function sortActiveTodos(todos: readonly TodoItem[]): TodoItem[] {
    return [...todos]
        .filter((todo) => isTodoActive(todo))
        .sort((a, b) => {
            if (a.favorite !== b.favorite) {
                return Number(b.favorite) - Number(a.favorite);
            }

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
}

@Component({
    selector: 'app-todo-page',
    standalone: true,
    imports: [TodoListComponent, TodoArchiveComponent],
    templateUrl: './todo-page.html',
    styleUrl: './todo-page.css',
})
export class TodoPageComponent {
    private readonly todoService = inject(TodoService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    protected readonly todos = signal<TodoItem[]>([]);
    protected readonly draft = signal('');
    protected readonly now = signal(Date.now());
    protected readonly archivePageSize = signal(10);
    protected readonly activeTodos = computed(() => sortActiveTodos(this.todos()).filter((todo) => isTodoActive(todo, this.now())));
    protected readonly archivedTodos = computed(() => this.todos()
        .filter((todo) => isTodoDone(todo, this.now()))
        .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!)));

    constructor() {
        this.loadTodos();
        interval(60_000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.now.set(Date.now()));
    }

    protected updateDraft(value: string): void { this.draft.set(value); }

    protected async addTodo(): Promise<void> {
        const title = this.draft().trim();
        if (!title) return;
        this.todos.set(await this.todoService.addTodo(title));
        this.draft.set('');
    }

    protected async toggleTodo(id: string): Promise<void> {
        this.todos.set(await this.todoService.toggleTodo(id));
    }

    protected async toggleTodoFavorite(id: string): Promise<void> {
        this.todos.set(await this.todoService.toggleTodoFavorite(id));
    }

    protected openTodo(id: string): void {
        this.router.navigateByUrl(`/todo/${id}`);
    }

    protected loadMore(): void { this.archivePageSize.update((size) => size + 10); }

    private async loadTodos(): Promise<void> { this.todos.set(await this.todoService.getTodos()); }
}
