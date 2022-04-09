import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculAbatementHeaderComponent } from './calcul-abatement-header.component';

describe('CalculAbatementHeaderComponent', () => {
  let component: CalculAbatementHeaderComponent;
  let fixture: ComponentFixture<CalculAbatementHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculAbatementHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculAbatementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
