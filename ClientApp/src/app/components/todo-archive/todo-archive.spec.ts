import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';

import { TodoArchiveComponent } from './todo-archive';

describe('TodoArchiveComponent', () => {
    it('emits the selected todo id when a done item is opened', () => {
        const injector = createEnvironmentInjector([]);
        const component = runInInjectionContext(injector, () => new TodoArchiveComponent());
        const spy = vi.fn();

        component.todoSelected.subscribe(spy);
        component.selectTodo('done-1');

        expect(spy).toHaveBeenCalledWith('done-1');
    });
});
