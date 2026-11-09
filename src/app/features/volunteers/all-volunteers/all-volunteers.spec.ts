import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllVolunteers } from './all-volunteers';

describe('AllVolunteers', () => {
  let component: AllVolunteers;
  let fixture: ComponentFixture<AllVolunteers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllVolunteers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllVolunteers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
