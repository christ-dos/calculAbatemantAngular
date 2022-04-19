import { HttpErrorResponse } from '@angular/common/http';
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
    public appComponent: AppComponent,
    private childService: ChildService,
    ) { 
      this.calculAbatementHomeComponent = new CalculAbatementHomeComponent(childService, monthlyService, appComponent);
    }

  public monthlies!: Monthly[];
  public children!: Child[];
  public childId!: number;
  public addMonthlyChild!: Child;
  public editMonthly!: Monthly;
  public deleteMonthly!: Monthly;
  public taxableSalarySibling!:number;
  
  ngOnInit(): void {
  this.getChildren();
  }

  public onGetMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm: NgForm): void{
   this.monthlyService.getMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm.value.year, this.childId).subscribe(
     (response: Monthly[]) => {
      this.monthlies = response;
       console.log(response);
       this.getChildren()
      }
    )
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe(
      (response: Child[]) => {
        console.log(response);
        this.children = response;
        },
        );
      }

  public getMonthliesByYearAndChildId(year: String, childId: number): void{
    this.monthlyService.getMonthliesByYearAndChildId(year, childId).subscribe(
      (response: Monthly[]) => {
        console.log(response);
        this.monthlies = response;
      }
    );
  }

  public onAddMonthly(addMonthlyForm: NgForm): void {
    document.getElementById('cancel-add-Monthly-form')?.click();
    console.log("childId: " + this.childId);
    console.log("addMonthlyFormBefore: " + addMonthlyForm.value.childId);
    addMonthlyForm.controls['childId'].setValue(this.childId);
    console.log("addMonthlyFormAfter: " + addMonthlyForm.value.childId);
    //todo clean les console.log
   this.monthlyService.addMonthly(addMonthlyForm.value).subscribe(
      (response: Monthly) => {
        console.log(response);
        this.getMonthliesByYearAndChildId(addMonthlyForm.value.year, addMonthlyForm.value.childId)
        addMonthlyForm.reset();
      }
    );
  }

  public onCalculateTaxableSalarySibling(taxableSalarySiblingForm: NgForm){
    document.getElementById('cancel-taxable-salary-sibling-form')?.click();
    this.monthlyService.getTaxableSalarySibling(
      taxableSalarySiblingForm.value.netSalary,taxableSalarySiblingForm.value.netBrutCoefficient,taxableSalarySiblingForm.value.maintenanceCost)
    .subscribe(
      (response: number) => {
        this.taxableSalarySibling = response
        console.log(response);
        taxableSalarySiblingForm.reset();
  }
  );
}

  public onUpdateMonthly(monthly: Monthly): void {
    this.monthlyService.updateMonthly(monthly).subscribe(
      (response: Monthly) => {
        console.log(response);
        this.getMonthliesByYearAndChildId(monthly.year,monthly.childId);
      }
    );
  }

  public onDeleteMonthly(monthlyId: number): void {
    this.monthlyService.deleteMonthly(monthlyId).subscribe(
      (response: void) => {
        console.log(response);
        this.getMonthliesByYearAndChildId(this.deleteMonthly.year, this.deleteMonthly.childId);
      }
    );
  }

  public onOpenModel(monthly: any, mode: string): void {
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (mode === 'editMonthly') {
          this.editMonthly = monthly;
          button.setAttribute('data-target', '#updateMonthlyModal');
        }
        if (mode === 'deleteMonthly') {
          this.deleteMonthly = monthly;
          button.setAttribute('data-target', '#deleteMonthlyModal');
        }
        if (mode === "addMonthly") {
          this.addMonthlyChild = monthly;
          button.setAttribute('data-target', '#addMonthlyModal');
        }
        if (mode === "taxableSalarySibling") {
          button.setAttribute('data-target', '#taxableSalarySiblingModal');
        }
        container?.appendChild(button);
        button.click();
      }
    



}
