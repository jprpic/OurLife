import { Component, input, output } from '@angular/core';

import { TodoItem } from '../../models/todo.model';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    templateUrl: './todo-list.html',
    styleUrl: './todo-list.css',
})
export class TodoListComponent {
    readonly todos = input.required<TodoItem[]>();
    readonly todoToggled = output<string>();
}
