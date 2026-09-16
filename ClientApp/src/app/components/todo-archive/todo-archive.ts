import { Component, input, output } from '@angular/core';

import { TodoItem } from '../../models/todo.model';

@Component({
    selector: 'app-todo-archive',
    standalone: true,
    templateUrl: './todo-archive.html',
    styleUrl: './todo-archive.css',
})
export class TodoArchiveComponent {
    readonly todos = input.required<TodoItem[]>();
    readonly visibleCount = input.required<number>();
    readonly loadMore = output<void>();
    readonly todoSelected = output<string>();

    protected formatDate(value: string): string {
        return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    protected selectTodo(id: string): void {
        this.todoSelected.emit(id);
    }
}
