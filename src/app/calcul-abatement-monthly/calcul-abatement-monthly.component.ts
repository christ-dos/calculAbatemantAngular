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

  constructor(
    private monthlyService: MonthlyService,
    public appComponent: AppComponent,
    private childService: ChildService,
  ) { }

  public monthlies!: Monthly[];
  public children!: Child[];
  public childId!: number;
  public childSelected!: Child;

  public addMonthlyChild!: Child;
  public editMonthly!: Monthly;
  public deleteMonthly!: Monthly;
  public taxableSalarySibling!: number;

  public months!: String[];
  public monthSelected!: String;

  public sumTaxableSalary!: number;
  public sumDaysWorked!: number;
  public sumHoursWorked!: number;
  public sumLunches!: number;
  public sumSnacks!: number;

  public errorMsg!: String;

  ngOnInit(): void {
    this.getChildren();
    this.getMonths();
  }

  public onGetMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm: NgForm): void {
    this.monthlyService.getMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm.value.year, this.childId).subscribe(
      {
        next: monthlies => {
          this.monthlies = monthlies;
          console.log(monthlies);

          this.sumTaxableSalary = this.monthlies.reduce((accumulator, monthly) => {
            return accumulator + monthly.taxableSalary;

          }, 0);

          this.sumDaysWorked = this.monthlies.reduce((accumulator, monthly) => {
            return accumulator + monthly.dayWorked;
          }, 0);

          this.sumHoursWorked = this.monthlies.reduce((accumulator, monthly) => {
            return accumulator + monthly.hoursWorked;
          }, 0);

          this.sumLunches = this.monthlies.reduce((accumulator, monthly) => {
            return accumulator + monthly.lunch;
          }, 0);

          this.sumSnacks = this.monthlies.reduce((accumulator, monthly) => {
            return accumulator + monthly.snack;
          }, 0);

          console.log("sumTaxableSalary: " + this.sumTaxableSalary); // clean code

          this.getChildren();
        },
        error: err => {
          this.errorMsg = err.message;
        }
      }
    );
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe({
      next: children => {
        console.log(children);
        this.children = children;
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public getMonthliesByYearAndChildId(year: String, childId: number): void {
    this.monthlyService.getMonthliesByYearAndChildId(year, childId).subscribe({
      next: monthlies => {
        console.log(monthlies);
        this.monthlies = monthlies;
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public getMonths(): void { // todo verfier si cette methode est utile ici???
    this.monthlyService.getMonths().subscribe({
      next: months => {
        console.log(months);
        this.months = months;
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public onAddMonthly(addMonthlyForm: NgForm): void {
    document.getElementById('cancel-add-Monthly-form')?.click();

    addMonthlyForm.controls['childId'].setValue(this.childId);
    addMonthlyForm.controls['month'].setValue(this.monthSelected);

    this.monthlyService.addMonthly(addMonthlyForm.value).subscribe({
      next: monthly => {
        console.log(monthly);
        this.getMonthliesByYearAndChildId(addMonthlyForm.value.year, addMonthlyForm.value.childId)

        addMonthlyForm.reset();
        document.getElementById('search-monthlies')?.click();
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public onCalculateTaxableSalarySibling(taxableSalarySiblingForm: NgForm) {
    document.getElementById('cancel-taxable-salary-sibling-form')?.click();
    this.monthlyService.getTaxableSalarySibling(
      taxableSalarySiblingForm.value.netSalary, taxableSalarySiblingForm.value.netBrutCoefficient, taxableSalarySiblingForm.value.maintenanceCost)
      .subscribe({
        next: taxableSalarySibling => {
          this.taxableSalarySibling = taxableSalarySibling;
          console.log(taxableSalarySibling);
          taxableSalarySiblingForm.reset();
        },
        error: err => {
          this.errorMsg = err.message;
        }
      }
      );
  }

  public onUpdateMonthly(monthly: Monthly): void {
    this.monthlyService.updateMonthly(monthly).subscribe({
      next: monthly => {
        console.log(monthly);
        this.getMonthliesByYearAndChildId(monthly.year, monthly.childId);
        this.getChildren();
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public onDeleteMonthly(monthlyId: number): void {
    this.monthlyService.deleteMonthly(monthlyId).subscribe({
      next: monthlyDeleted => {
        console.log(monthlyDeleted);
        this.getMonthliesByYearAndChildId(this.deleteMonthly.year, this.deleteMonthly.childId);
        document.getElementById('search-monthlies')?.click();
      },
      error: err => {
        this.errorMsg = err.message;
      }
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
