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
            note: null,
            createdAt: new Date().toISOString(),
            completedAt: null,
            favorite: false,
        };
        return this.saveTodos([todo, ...todos]);
    }

    async updateTodo(todo: TodoItem): Promise<TodoItem[]> {
        const todos = await this.getTodos();
        const updated = todos.map((item) => item.id === todo.id ? { ...item, ...todo } : item);
        return this.saveTodos(updated);
    }

    async deleteTodo(id: string): Promise<TodoItem[]> {
        const todos = await this.getTodos();
        return this.saveTodos(todos.filter((todo) => todo.id !== id));
    }

    async toggleTodo(id: string): Promise<TodoItem[]> {
        const todos = await this.getTodos();
        const updated = todos.map((todo) => {
            if (todo.id !== id) return todo;

            const isCompleting = !todo.completedAt;
            if (isCompleting) {
                return {
                    ...todo,
                    completedAt: new Date().toISOString(),
                };
            }

            const wasDone = !!todo.completedAt && (Date.now() - new Date(todo.completedAt).getTime()) >= 5 * 60 * 1000;
            return {
                ...todo,
                completedAt: null,
                favorite: wasDone ? false : todo.favorite,
            };
        });
        return this.saveTodos(updated);
    }

    async toggleTodoFavorite(id: string): Promise<TodoItem[]> {
        const todos = await this.getTodos();
        const updated = todos.map((todo) => todo.id === id
            ? { ...todo, favorite: !todo.favorite }
            : todo);
        return this.saveTodos(updated);
    }

    private async saveTodos(todos: TodoItem[]): Promise<TodoItem[]> {
        await set(todosKey, todos, todoStore);
        return todos;
    }
}
