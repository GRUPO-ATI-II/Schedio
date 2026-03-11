import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCard } from './task-card';

describe('TaskCard', () => {
  let component: TaskCard;
  let fixture: ComponentFixture<TaskCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCard);
    component = fixture.componentInstance;
    component.title = 'Tarea de prueba';
    component.dueAt = new Date(Date.now() + 86400000);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
