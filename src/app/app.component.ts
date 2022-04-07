import { Component, Input, OnInit } from '@angular/core';
import { Child } from './models/child.model';
import { ChildService } from './services/child.service';
import { Observable } from "rxjs";
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm, NgModel } from '@angular/forms';
import { waitForAsync } from '@angular/core/testing';
import { Monthly } from './models/Monthly.model';
import { MonthlyService } from './services/monthly.service';




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
          this.getAnnualReportableAmounts(child, 1, 0.5);
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
    console.log(addMonthlyForm.value.month);
    
    this.monthlyService.addMonthly(addMonthlyForm.value).subscribe(
      (response: Monthly) => {
        console.log(response);
        this.getChildren();
        addMonthlyForm.reset();
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
    container?.appendChild(button);
    button.click();
  }
}
function addMonthlyFormValues(addMonthlyFormValues: any) {
  throw new Error('Function not implemented.');
}

