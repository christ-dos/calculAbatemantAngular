import { Component, Input, OnInit } from '@angular/core';
import { Child } from './models/child.model';
import { ChildService } from './services/child.service';
import { NgForm } from '@angular/forms';
import { MonthlyService } from './services/monthly.service';
import { Monthly } from './models/monthly.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public children: Child[] = [];
  public editChild!: Child;
  public deleteChild!: Child;
  public currentYear!: String;
  public currentMonth!: Date;
  public taxableSalary!: number;
  public reportableAmounts!: number;
  public addMonthlyChild!: Child;
  public taxableSalarySibling!: number;


  constructor(private childService: ChildService,
    private monthlyService: MonthlyService) { }

  ngOnInit(): void {
    this.getChildren();
    this.currentYear = new String(new Date().getFullYear());
    this.currentMonth = new Date();
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe(
      (response: Child[]) => {
        console.log("responsegetChild: " + response);
        this.children = response;
        this.children.forEach((child) => {
          this.getTaxableSalary(child);
          this.getAnnualReportableAmounts(child, 1, 0.5); // todo ne plus mettre tarif repas et gouter en dur 
          //a recuperer de la vue
        });
      }
    )
  }

  public getTaxableSalary(child: Child): void {
    this.childService.getTaxableSalary(child.id, this.currentYear).subscribe(
      (response: number) => {
        this.taxableSalary = response;
        child.taxableSalary = this.taxableSalary;
      }
    )
  }

  public getAnnualReportableAmounts(child: Child, feeLunch: number, feeTaste: number): void {
    this.childService.getAnnualReportableAmounts(child.id, this.currentYear, feeLunch, feeTaste).subscribe(
      (response: number) => {
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
    document.getElementById('cancel-add-Monthly-form')?.click();
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
    if (mode === 'add') {
      button.setAttribute('data-target', '#addChildModal');
    }
    if (mode === 'edit') {
      this.editChild = child;
      button.setAttribute('data-target', '#updateChildModal');
    }
    if (mode === 'delete') {
      this.deleteChild = child;
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
function addMonthlyFormValues(addMonthlyFormValues: any) {
  throw new Error('Function not implemented.');
}

