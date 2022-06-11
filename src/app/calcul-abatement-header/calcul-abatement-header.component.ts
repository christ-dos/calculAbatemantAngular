import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CalculAbatementHomeComponent } from '../calcul-abatement-home/calcul-abatement-home.component';
import { Child } from '../models/child.model';
import { Monthly } from '../models/monthly.model';
import { ChildService } from '../services/child.service';
import { MonthlyService } from '../services/monthly.service';

@Component({
  selector: 'app-calcul-abatement-header',
  templateUrl: './calcul-abatement-header.component.html',
  styleUrls: ['./calcul-abatement-header.component.css']
})
export class CalculAbatementHeaderComponent implements OnInit {
  public calculAbatementHomeComponent!: CalculAbatementHomeComponent;

  constructor
    (private monthlyService: MonthlyService,
      public appComponent: AppComponent,
      private childService: ChildService,
      private fb: FormBuilder,) {

    this.calculAbatementHomeComponent = new CalculAbatementHomeComponent(childService, monthlyService, appComponent, fb);

  }

  public addMonthlyChild!: Child;

  public ChildrenHeader!: Child[];
  ngOnInit(): void {
    
  }
  
  // public getChildren() : void {;
  //   this.childService.getAllChildren().subscribe(
  //     (response: Child[]) => {
  //       console.log(response);
  //       this.ChildrenHeader = response;
  //     },
  //   );
  // }

}
