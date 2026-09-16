import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { isTodoActive, isTodoDone, sortActiveTodos, toggleFavorite, toggleTodoCompletion } from './todo-page';

describe('todo-page derived completion logic', () => {
    it('treats a todo as done only after 5 minutes have passed', () => {
        const now = Date.now();

        expect(isTodoDone({ id: '1', title: 'Write report', createdAt: new Date(now - 4 * 60 * 1000).toISOString(), completedAt: new Date(now - 4 * 60 * 1000).toISOString(), favorite: false }, now)).toBeFalsy();
        expect(isTodoDone({ id: '1', title: 'Write report', createdAt: new Date(now - 10 * 60 * 1000).toISOString(), completedAt: new Date(now - 10 * 60 * 1000).toISOString(), favorite: false }, now)).toBeTruthy();
        expect(isTodoDone({ id: '1', title: 'Write report', createdAt: new Date(now - 10 * 60 * 1000).toISOString(), completedAt: null, favorite: false }, now)).toBeFalsy();
    });

    it('keeps recent completions in the active list and moves older ones to done', () => {
        const now = Date.now();
        const recent = { id: '1', title: 'Recent', createdAt: new Date(now - 60_000).toISOString(), completedAt: new Date(now - 60_000).toISOString(), favorite: false };
        const stale = { id: '2', title: 'Stale', createdAt: new Date(now - 10 * 60_000).toISOString(), completedAt: new Date(now - 10 * 60_000).toISOString(), favorite: false };

        expect(isTodoActive(recent, now)).toBeTruthy();
        expect(isTodoActive(stale, now)).toBeFalsy();
        expect(isTodoDone(recent, now)).toBeFalsy();
        expect(isTodoDone(stale, now)).toBeTruthy();
    });

    it('keeps favorites first in the active list while preserving creation order for non-favorites', () => {
        const olderFavorite = { id: '1', title: 'Old favorite', createdAt: '2024-01-01T00:00:00.000Z', completedAt: null, favorite: true };
        const newerNonFavorite = { id: '2', title: 'New task', createdAt: '2024-01-02T00:00:00.000Z', completedAt: null, favorite: false };
        const olderNonFavorite = { id: '3', title: 'Older task', createdAt: '2023-12-31T00:00:00.000Z', completedAt: null, favorite: false };
        const newerFavorite = { id: '4', title: 'New favorite', createdAt: '2024-01-03T00:00:00.000Z', completedAt: null, favorite: true };

        const sorted = sortActiveTodos([newerNonFavorite, olderFavorite, olderNonFavorite, newerFavorite]);

        expect(sorted.map((todo) => todo.id)).toEqual(['4', '1', '2', '3']);
    });

    it('keeps a favorite when an active item is accidentally completed and reopened before it is done', () => {
        const original = { id: '1', title: 'Urgent task', createdAt: '2024-01-01T00:00:00.000Z', completedAt: null, favorite: true };
        const completed = toggleTodoCompletion(original, true);
        const reopened = toggleTodoCompletion(completed, false);

        expect(completed.favorite).toBeTruthy();
        expect(completed.completedAt).not.toBeNull();
        expect(reopened.favorite).toBeTruthy();
        expect(reopened.completedAt).toBeNull();
    });

    it('clears favorite state only when a truly done item is reopened', () => {
        const done = { id: '2', title: 'Done task', createdAt: '2024-01-01T00:00:00.000Z', completedAt: '2024-01-01T00:06:00.000Z', favorite: true };
        const reopened = toggleTodoCompletion(done, false);

        expect(reopened.favorite).toBeFalsy();
        expect(reopened.completedAt).toBeNull();
    });

    it('toggles favorite state without altering completion state', () => {
        const active = { id: '1', title: 'Review', createdAt: '2024-01-01T00:00:00.000Z', completedAt: null, favorite: false };
        const toggled = toggleFavorite(active);

        expect(toggled.favorite).toBeTruthy();
        expect(toggled.completedAt).toBeNull();
    });
});
