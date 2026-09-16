import '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { ToBuyPageComponent } from './to-buy-page';

describe('ToBuyPageComponent', () => {
    let fixture: ComponentFixture<ToBuyPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToBuyPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ToBuyPageComponent);
        fixture.detectChanges();
    });

    it('should render the shopping category drawers', () => {
        const text = fixture.nativeElement.textContent as string;
        expect(text).toContain('Groceries');
        expect(text).toContain('Hygiene');
        expect(text).toContain('Hardware');
    });

    it('should include the household category in the global category picker', () => {
        const categoryPicker = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
        const householdOption = Array.from(categoryPicker.options).find((option) => option.value === 'household');

        expect(householdOption?.textContent).toContain('Household');
    });

    it('should not render per-category add controls', () => {
        const text = fixture.nativeElement.textContent as string;

        expect(text).not.toContain('+ Add');
        expect(text).not.toContain('Cancel');
        expect(text).not.toContain('Save');
    });
});
