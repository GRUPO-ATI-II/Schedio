import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAppComponent } from './main-app';

describe('MainAppComponent', () => {
  let component: MainAppComponent;
  let fixture: ComponentFixture<MainAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainAppComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
