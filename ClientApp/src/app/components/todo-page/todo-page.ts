import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

import { TodoItem } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { TodoArchiveComponent } from '../todo-archive/todo-archive';
import { TodoListComponent } from '../todo-list/todo-list';

@Component({
    selector: 'app-todo-page',
    standalone: true,
    imports: [TodoListComponent, TodoArchiveComponent],
    templateUrl: './todo-page.html',
    styleUrl: './todo-page.css',
})
export class TodoPageComponent {
    private readonly todoService = inject(TodoService);
    private readonly destroyRef = inject(DestroyRef);
    protected readonly todos = signal<TodoItem[]>([]);
    protected readonly draft = signal('');
    protected readonly now = signal(Date.now());
    protected readonly archivePageSize = signal(10);
    protected readonly activeTodos = computed(() => this.todos().filter((todo) => !todo.completedAt || this.isRecent(todo)));
    protected readonly archivedTodos = computed(() => this.todos()
        .filter((todo) => !!todo.completedAt && !this.isRecent(todo))
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

    protected loadMore(): void { this.archivePageSize.update((size) => size + 10); }

    private async loadTodos(): Promise<void> { this.todos.set(await this.todoService.getTodos()); }

    private isRecent(todo: TodoItem): boolean {
        return this.now() - new Date(todo.completedAt!).getTime() < 24 * 60 * 60 * 1000;
    }
}
