import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculAbatementHomeComponent } from './calcul-abatement-home.component';

describe('CalculAbatementHomeComponent', () => {
  let component: CalculAbatementHomeComponent;
  let fixture: ComponentFixture<CalculAbatementHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculAbatementHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculAbatementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
