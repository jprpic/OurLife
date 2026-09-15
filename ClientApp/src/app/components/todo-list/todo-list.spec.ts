import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';

import { TodoListComponent } from './todo-list';

describe('TodoListComponent', () => {
    it('emits the selected todo id when a row is opened', () => {
        const injector = createEnvironmentInjector([]);
        const component = runInInjectionContext(injector, () => new TodoListComponent());
        const spy = vi.fn();

        component.todoSelected.subscribe(spy);
        component.activateTodo('todo-1');

        expect(spy).toHaveBeenCalledWith('todo-1');
    });

    it('emits the toggled todo id when the completion control is used', () => {
        const injector = createEnvironmentInjector([]);
        const component = runInInjectionContext(injector, () => new TodoListComponent());
        const spy = vi.fn();

        component.todoToggled.subscribe(spy);
        component.toggleTodo('todo-2');

        expect(spy).toHaveBeenCalledWith('todo-2');
    });
});
