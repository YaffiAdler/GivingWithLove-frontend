import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eichud } from './eichud';

describe('Eichud', () => {
  let component: Eichud;
  let fixture: ComponentFixture<Eichud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eichud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Eichud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
