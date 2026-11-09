import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepDataDisplay } from './deep-data-display';

describe('DeepDataDisplay', () => {
  let component: DeepDataDisplay;
  let fixture: ComponentFixture<DeepDataDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeepDataDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeepDataDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
