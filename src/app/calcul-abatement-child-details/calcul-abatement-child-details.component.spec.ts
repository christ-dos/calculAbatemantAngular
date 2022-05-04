import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculAbatementChildDetailsComponent } from './calcul-abatement-child-details.component';

describe('CalculAbatementChildDetailsComponent', () => {
  let component: CalculAbatementChildDetailsComponent;
  let fixture: ComponentFixture<CalculAbatementChildDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculAbatementChildDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculAbatementChildDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
