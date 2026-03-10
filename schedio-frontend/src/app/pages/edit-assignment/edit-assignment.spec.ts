import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EditAssignment } from './edit-assignment';

describe('EditAssignment', () => {
  let component: EditAssignment;
  let fixture: ComponentFixture<EditAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAssignment],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAssignment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
