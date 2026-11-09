import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVolunteer } from './add-volunteer';

describe('AddVolunteer', () => {
  let component: AddVolunteer;
  let fixture: ComponentFixture<AddVolunteer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVolunteer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVolunteer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
