import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidData } from './mid-data';

describe('MidData', () => {
  let component: MidData;
  let fixture: ComponentFixture<MidData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MidData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
