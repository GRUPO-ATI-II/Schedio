import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTab } from './calendar-tab';

describe('CalendarTab', () => {
  let component: CalendarTab;
  let fixture: ComponentFixture<CalendarTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
