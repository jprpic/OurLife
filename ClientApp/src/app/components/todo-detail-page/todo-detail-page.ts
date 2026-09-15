import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TodoItem } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
    selector: 'app-todo-detail-page',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './todo-detail-page.html',
    styleUrl: './todo-detail-page.css',
})
export class TodoDetailPageComponent {
    private readonly route = inject(ActivatedRoute);
    protected readonly router = inject(Router);
    private readonly todoService = inject(TodoService);
    protected readonly todo = signal<TodoItem | null>(null);
    protected readonly isSaving = signal(false);
    protected readonly note = signal('');

    constructor() {
        this.route.paramMap.subscribe(async (params) => {
            const id = params.get('id');
            if (!id) {
                this.router.navigateByUrl('/todo');
                return;
            }

            const todos = await this.todoService.getTodos();
            const item = todos.find((todo) => todo.id === id) ?? null;
            this.todo.set(item);
            this.note.set(item?.note ?? '');
        });
    }

    protected readonly isComplete = computed(() => !!this.todo()?.completedAt);

    protected updateTitle(value: string): void {
        const current = this.todo();
        if (!current) return;
        this.todo.set({ ...current, title: value });
    }

    protected updateNote(value: string): void {
        this.note.set(value);
        const current = this.todo();
        if (!current) return;
        this.todo.set({ ...current, note: value.trim() ? value : null });
    }

    protected async save(): Promise<void> {
        const current = this.todo();
        if (!current) return;

        const trimmedTitle = current.title.trim();
        if (!trimmedTitle) return;

        this.isSaving.set(true);
        const saved = { ...current, note: this.note().trim() ? this.note().trim() : null, title: trimmedTitle };
        this.todo.set(saved);
        await this.todoService.updateTodo(saved);
        this.isSaving.set(false);
        await this.router.navigateByUrl('/todo');
    }

    protected async toggleComplete(): Promise<void> {
        const current = this.todo();
        if (!current) return;

        const updated = { ...current, completedAt: current.completedAt ? null : new Date().toISOString() };
        this.todo.set(updated);
        await this.todoService.updateTodo(updated);
    }

    protected async removeTodo(): Promise<void> {
        const current = this.todo();
        if (!current) return;

        await this.todoService.deleteTodo(current.id);
        await this.router.navigateByUrl('/todo');
    }
}
