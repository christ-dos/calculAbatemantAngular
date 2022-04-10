import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculAbatementMonthlyComponent } from './calcul-abatement-monthly.component';

describe('CalculAbatementMonthlyComponent', () => {
  let component: CalculAbatementMonthlyComponent;
  let fixture: ComponentFixture<CalculAbatementMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculAbatementMonthlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculAbatementMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
