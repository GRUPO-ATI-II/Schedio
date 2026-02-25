import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCalendar } from './personal-calendar';

describe('PersonalCalendar', () => {
  let component: PersonalCalendar;
  let fixture: ComponentFixture<PersonalCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
