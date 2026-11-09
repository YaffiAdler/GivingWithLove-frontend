import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerDetails } from './volunteer-details';

describe('VolunteerDetails', () => {
  let component: VolunteerDetails;
  let fixture: ComponentFixture<VolunteerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
