import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardCheckbox } from './card-checkbox';

describe('CardCheckbox', () => {
  let component: CardCheckbox;
  let fixture: ComponentFixture<CardCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCheckbox],
    }).compileComponents();

    fixture = TestBed.createComponent(CardCheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
