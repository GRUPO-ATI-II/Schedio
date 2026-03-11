import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectBaseButton } from './rect-base-button';

describe('RectBaseButton', () => {
  let component: RectBaseButton;
  let fixture: ComponentFixture<RectBaseButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RectBaseButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectBaseButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
