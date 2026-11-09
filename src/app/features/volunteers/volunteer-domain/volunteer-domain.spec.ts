import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerDomain } from './volunteer-domain';

describe('VolunteerDomain', () => {
  let component: VolunteerDomain;
  let fixture: ComponentFixture<VolunteerDomain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerDomain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerDomain);
    fixture.componentRef.setInput('projects', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
