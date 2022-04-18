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
    console.log("childId: " + this.childId);
    document.getElementById('cancel-add-Monthly-form')?.click();
    console.log("addMonthlyFormBefore: " + addMonthlyForm.value.childId);
    addMonthlyForm.controls['childId'].setValue(this.childId);
    console.log("addMonthlyFormAfter: " + addMonthlyForm.value.childId);
   this.monthlyService.addMonthly(addMonthlyForm.value).subscribe(
      (response: Monthly) => {
        console.log(response);
        this.getMonthliesByYearAndChildId(addMonthlyForm.value.year, addMonthlyForm.value.childId)
        addMonthlyForm.reset();
      }
      //,
      //(error: HttpErrorResponse) => {
       // alert(error.message);

     // }
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

  public onOpenModel(child: any, mode: string): void {
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (mode === 'editMonthly') {
          this.editMonthly = child;
          button.setAttribute('data-target', '#updateChildModal');
        }
        if (mode === 'deleteMonthly') {
          this.deleteMonthly = child;
          button.setAttribute('data-target', '#deleteChildModal');
        }
        if (mode === "addMonthly") {
          this.addMonthlyChild = child;
          button.setAttribute('data-target', '#addMonthlyModal');
        }
        if (mode === "taxableSalarySibling") {
          button.setAttribute('data-target', '#taxableSalarySiblingModal');
        }
        container?.appendChild(button);
        button.click();
      }
    



}
