import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecificUserCredentials } from './edit-specific-user-credentials';

describe('EditSpecificUserCredentials', () => {
  let component: EditSpecificUserCredentials;
  let fixture: ComponentFixture<EditSpecificUserCredentials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSpecificUserCredentials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSpecificUserCredentials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
