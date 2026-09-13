import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
