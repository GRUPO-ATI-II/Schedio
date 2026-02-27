import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReport } from './ticket-report';

describe('TicketReport', () => {
  let component: TicketReport;
  let fixture: ComponentFixture<TicketReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
