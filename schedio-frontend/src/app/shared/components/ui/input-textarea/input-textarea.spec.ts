import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextarea } from './input-textarea';

describe('InputTextarea', () => {
  let component: InputTextarea;
  let fixture: ComponentFixture<InputTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextarea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTextarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
