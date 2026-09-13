import { Injectable } from '@angular/core';
import { createStore, get, set } from 'idb-keyval';

import { TodoItem } from '../models/todo.model';

const todoStore = createStore('our-life-db', 'todo-store');
const todosKey = 'todos';

@Injectable({ providedIn: 'root' })
export class TodoService {
    async getTodos(): Promise<TodoItem[]> {
        const todos = await get<TodoItem[]>(todosKey, todoStore);
        return todos ?? [];
    }

    async addTodo(title: string): Promise<TodoItem[]> {
        const todos = await this.getTodos();
        const todo: TodoItem = {
            id: crypto.randomUUID(),
            title,
            createdAt: new Date().toISOString(),
            completedAt: null,
        };
        return this.saveTodos([todo, ...todos]);
    }

    async toggleTodo(id: string): Promise<TodoItem[]> {
        const todos = await this.getTodos();
        const updated = todos.map((todo) => todo.id === id
            ? { ...todo, completedAt: todo.completedAt ? null : new Date().toISOString() }
            : todo);
        return this.saveTodos(updated);
    }

    private async saveTodos(todos: TodoItem[]): Promise<TodoItem[]> {
        await set(todosKey, todos, todoStore);
        return todos;
    }
}
