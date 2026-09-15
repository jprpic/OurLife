import { describe, expect, it } from 'vitest';

import { isTodoActive, isTodoDone } from './todo-page';

describe('todo-page derived completion logic', () => {
    it('treats a todo as done only after 5 minutes have passed', () => {
        const now = Date.now();

        expect(isTodoDone({ id: '1', title: 'Write report', createdAt: new Date(now - 4 * 60 * 1000).toISOString(), completedAt: new Date(now - 4 * 60 * 1000).toISOString() }, now)).toBeFalsy();
        expect(isTodoDone({ id: '1', title: 'Write report', createdAt: new Date(now - 10 * 60 * 1000).toISOString(), completedAt: new Date(now - 10 * 60 * 1000).toISOString() }, now)).toBeTruthy();
        expect(isTodoDone({ id: '1', title: 'Write report', createdAt: new Date(now - 10 * 60 * 1000).toISOString(), completedAt: null }, now)).toBeFalsy();
    });

    it('keeps recent completions in the active list and moves older ones to done', () => {
        const now = Date.now();
        const recent = { id: '1', title: 'Recent', createdAt: new Date(now - 60_000).toISOString(), completedAt: new Date(now - 60_000).toISOString() };
        const stale = { id: '2', title: 'Stale', createdAt: new Date(now - 10 * 60_000).toISOString(), completedAt: new Date(now - 10 * 60_000).toISOString() };

        expect(isTodoActive(recent, now)).toBeTruthy();
        expect(isTodoActive(stale, now)).toBeFalsy();
        expect(isTodoDone(recent, now)).toBeFalsy();
        expect(isTodoDone(stale, now)).toBeTruthy();
    });
});
