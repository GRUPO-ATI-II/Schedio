import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetUserCredentials } from './reset-user-credentials';

describe('ResetUserCredentials', () => {
  let component: ResetUserCredentials;
  let fixture: ComponentFixture<ResetUserCredentials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetUserCredentials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetUserCredentials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
