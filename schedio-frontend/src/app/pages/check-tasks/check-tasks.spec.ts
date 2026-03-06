import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTasks } from './check-tasks';

describe('CheckTasks', () => {
  let component: CheckTasks;
  let fixture: ComponentFixture<CheckTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
