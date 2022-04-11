import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponent } from '../app.component';
import { CalculAbatementHomeComponent } from '../calcul-abatement-home/calcul-abatement-home.component';
import { Child } from '../models/child.model';
import { Monthly } from '../models/monthly.model';
import { ChildService } from '../services/child.service';
import { MonthlyService } from '../services/monthly.service';

@Component({
  selector: 'app-calcul-abatement-monthly',
  templateUrl: './calcul-abatement-monthly.component.html',
  styleUrls: ['./calcul-abatement-monthly.component.css']
})
export class CalculAbatementMonthlyComponent implements OnInit {
  public calculAbatementHomeComponent!: CalculAbatementHomeComponent;

  constructor(private monthlyService: MonthlyService, 
    private appComponent: AppComponent,
    private childService: ChildService
    ) { 
      this.calculAbatementHomeComponent = new CalculAbatementHomeComponent(childService, monthlyService, appComponent);
    }

  public monthlies!: Monthly[];
  public children!: Child[];
  public childId!: number;
  
  ngOnInit(): void {
  this.getChildren();
  }

  public onGetMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm: NgForm): void{
   this.monthlyService.getMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm.value.year, this.childId).subscribe(
     (response: Monthly[]) => {
      this.monthlies = response;
       console.log(response);
       
      }
    )
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe(
      (response: Child[]) => {
        console.log(response);
        this.children = response;
        });
      }



}
