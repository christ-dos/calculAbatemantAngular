import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponent } from '../app.component';
import { Child } from '../models/child.model';
import { Monthly } from '../models/monthly.model';
import { ChildService } from '../services/child.service';
import { MonthlyService } from '../services/monthly.service';

@Component({
  selector: 'app-calcul-abatement-home',
  templateUrl: './calcul-abatement-home.component.html',
  styleUrls: ['./calcul-abatement-home.component.css']
})
export class CalculAbatementHomeComponent implements OnInit {

  constructor(
    private childService: ChildService,
    private monthlyService: MonthlyService, 
    public appComponent: AppComponent) {}

    public children!: Child[];
    public editChild!: Child;
    public deleteChild!: Child;
    public feesChild!: Child;
   
    public taxableSalary!: number;
    public reportableAmounts!: number;
    public childId!:number;
    public addMonthlyChild!: Child;
    public taxableSalarySibling!: number;


  ngOnInit(): void {
    this.getChildren();
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe(
      (response: Child[]) => {
        console.log(response);
        this.children = response;
        this.children.forEach((child) => {
          if(child.monthlies != null){
            this.getTaxableSalary(child);
            this.getAnnualReportableAmounts(child);
          }
        });
      }
    )
  }

  public getTaxableSalary(child: Child): void {
    this.childService.getTaxableSalary(child.id, this.appComponent.currentYear).subscribe(
      (response: number) => {
        console.log(response);
        this.taxableSalary = response;
        child.taxableSalary = this.taxableSalary;
      }
    )
  }


  public getAnnualReportableAmounts(child: Child): void {
    this.childService.getAnnualReportableAmounts(child.id, this.appComponent.currentYear).subscribe(
      (response: number) => {
        console.log(response);
        this.reportableAmounts = response;
        child.reportableAmounts = this.reportableAmounts;
      }
    )
  }

  public onAddChild(addForm: NgForm): void {
    document.getElementById('cancel-add-child-form')?.click();
    this.childService.addChild(addForm.value).subscribe(
      (response: Child) => {
        console.log(response);
        this.getChildren();
        addForm.reset();
      }
    );
  }

  public onAddMonthly(addMonthlyForm: NgForm): void {
    console.log("addMonthlyForm: " + addMonthlyForm.value.childId);
    document.getElementById('cancel-add-Monthly-form')?.click();
    addMonthlyForm.controls['childId'].setValue(this.childId);
    this.monthlyService.addMonthly(addMonthlyForm.value).subscribe(
      (response: Monthly) => {
        console.log(response);
        console.log(addMonthlyForm.value);
        this.getChildren();
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

  public onUpdateChild(child: Child): void {
    this.childService.updateChild(child).subscribe(
      (response: Child) => {
        console.log(response);
        this.getChildren();
      }
    );
  }

  public onDeleteChild(childId: number): void {
    this.childService.deleteChild(childId).subscribe(
      (response: void) => {
        console.log(response);
        this.getChildren();
      }
    );
  }

 public onOpenModel(child: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'edit') {
      this.editChild = child;
      button.setAttribute('data-target', '#updateChildModal');
    }
    if (mode === 'delete') {
      this.deleteChild = child;
      button.setAttribute('data-target', '#deleteChildModal');
    }
    if (mode === "addMonthly") {
      this.childId = child;
      button.setAttribute('data-target', '#addMonthlyModal');
    }
    if (mode === "taxableSalarySibling") {
      button.setAttribute('data-target', '#taxableSalarySiblingModal');
    }
    container?.appendChild(button);
    button.click();
  }

}
