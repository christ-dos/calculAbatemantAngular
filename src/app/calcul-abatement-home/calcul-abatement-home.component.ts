

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { AppComponent } from '../app.component';
import { CalculAbatementMonthlyComponent } from '../calcul-abatement-monthly/calcul-abatement-monthly.component';
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
  public calculAbatementMonthlyComponent!: CalculAbatementMonthlyComponent;

  constructor(
    private childService: ChildService,
    private monthlyService: MonthlyService,
    public appComponent: AppComponent
  ) {
    this.calculAbatementMonthlyComponent = new CalculAbatementMonthlyComponent(
      monthlyService, appComponent, childService);
  }
  

  public children!: Child[];
  public editChild!: Child;
  public deleteChild!: Child;
  public feesChild!: Child;

  public taxableSalary!: number;
  public taxableSalarySibling!: number;
  public reportableAmounts!: number;
  public taxRelief!: number;

  public childId!: number;
  public addMonthlyChild!: Child;
  public monthSelected!: String;

  public sumTaxRelief!: number;
  public sumReportableAmount!: number;
  public sumTaxableSalary!: number;
  public summaryYear!: String;

  public yearPrecedingCurrentYear: String = new String(new Date().getFullYear() - 1);
  public erroMessage!: String;
  public currentYear: String = this.appComponent.currentYear;

  public selectedFile!: File;
  public urlLink!: string;
  public errorMsg!: String;

  @ViewChild('content', { static: false })
  public el!: ElementRef;

  ngOnInit(): void {
    this.getChildren();
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe({
      next: children => {
        console.log(children);
        this.children = children;
        this.calculAbatementMonthlyComponent.getMonths();
        this.children.forEach((child) => {
          if (child.monthlies.some(monthly => monthly.year === this.appComponent.currentYear)) {
            this.getTaxableSalary(child, this.appComponent.currentYear);
            this.getAnnualReportableAmounts(child, this.appComponent.currentYear);
            this.getTaxRelief(child, this.appComponent.currentYear);
          } else {
            child.taxableSalary = 0;
            child.taxRelief = 0;
            child.reportableAmounts = 0;
          }
        });
      },
      error: err => {
        this.errorMsg = err.message;
      }
    });
  }

  public getTaxableSalary(child: Child, year: String): void {
    this.childService.getTaxableSalary(child.id, year).subscribe({
      next: taxableSalary => {
        this.taxableSalary = taxableSalary;
        child.taxableSalary = this.taxableSalary;
      },
      error: err => {
        this.erroMessage = err;
        console.log("mon erreur: " + this.erroMessage);
      }
    }
    );
  }

  public getAnnualReportableAmounts(child: Child, year: String): void {
    // this.childService.getAnnualReportableAmounts(child.id, year).subscribe(
    //   (response: number) => {
    //     console.log(response);
    //     this.reportableAmounts = response;
    //     child.reportableAmounts = this.reportableAmounts;
    //   }
    // );

    this.childService.getAnnualReportableAmounts(child.id, year).subscribe({
      next: annualReportableAmounts => {
        console.log(annualReportableAmounts);
        this.reportableAmounts = annualReportableAmounts;
        child.reportableAmounts = this.reportableAmounts;
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public getTaxRelief(child: Child, year: String): void {
    // this.childService.getTaxRelief(child.id, year).subscribe(
    //   (response: number) => {
    //     console.log(response);
    //     this.taxRelief = response;
    //     child.taxRelief = this.taxRelief;
    //   }
    // );

    this.childService.getTaxRelief(child.id, year).subscribe({
      next: taxRelief => {
        console.log(taxRelief);
        this.taxRelief = taxRelief;
        child.taxRelief = this.taxRelief;
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }

    );
  }

  public onSummaryModal(year: String): void {
    this.currentYear = year;

    this.children.forEach((child) => {
      if (child.monthlies.some(monthly => monthly.year === year)) {
        this.getTaxableSalary(child, year);
        this.getTaxRelief(child, year);
        this.getAnnualReportableAmounts(child, year);
      } else {
        child.taxableSalary = 0;
        child.taxRelief = 0;
        child.reportableAmounts = 0;
      }
    });

    setTimeout(() => {
      this.sumTaxableSalary = this.children.reduce((accumulator, child) => {
        return accumulator + child.taxableSalary;
      }, 0);
    }, 400);

    setTimeout(() => {
      this.sumTaxRelief = this.children.reduce((accumulator, child) => {
        return accumulator + child.taxRelief;
      }, 0);
    }, 800);

    setTimeout(() => {
      this.sumReportableAmount = this.children.reduce((accumulator, child) => {
        return accumulator + child.reportableAmounts;
      }, 0);
    }, 900);
  }

  public onSelectImage(event: any): void {

    this.selectedFile = <File>event.target.files[0];

    //Todo clean code
    // if(event.target.files){
    //  var reader = new FileReader();
    // reader.readAsDataURL(event.target.files[0]);
    // reader.onload = (event: any) => {
    // this.urlLink = event.target.result ;
    // let imageUrl = document.getElementById('imageUrl')?.setAttribute("src", this.urlLink);
    // imageUrl = event.target.result ;
    console.log(this.selectedFile.name);


    //}
    // }
  }

  public onAddChild(addForm: NgForm): void {
    document.getElementById('cancel-add-child-form')?.click();
    //todo clean code
    // this.childService.addChild(addForm.value).subscribe(
    //   (response: Child) => {
    //     console.log(response);
    //     this.getChildren();
    //     addForm.reset();
    //   }
    // );

    this.childService.addChild(addForm.value).subscribe({
      next: child => {
        console.log(child);
        this.getChildren();
        addForm.reset();
      },
       error: err => {
        this.errorMsg = err.message;
      }
    }
    );
    document.getElementById('btn-add-child');
  }

  public onAddMonthly(addMonthlyForm: NgForm): void {
    console.log("addMonthlyForm: " + addMonthlyForm.value.childId);
    document.getElementById('cancel-add-Monthly-form')?.click();
    addMonthlyForm.controls['childId'].setValue(this.childId);
    //todo clean code

    // this.monthlyService.addMonthly(addMonthlyForm.value).subscribe(
    //   (response: Monthly) => {
    //     console.log(response);
    //     console.log(addMonthlyForm.value);
    //     this.getChildren();
    //     addMonthlyForm.reset();
    //   }
    // );

    this.monthlyService.addMonthly(addMonthlyForm.value).subscribe({
      next: monthly => {
        console.log(monthly);
        // console.log(addMonthlyForm.value);// todo clean code
        this.getChildren();
        addMonthlyForm.reset();
      }, error: err => {
        this.errorMsg = err.message;
      }
    }

    );
  }

  public onCalculateTaxableSalarySibling(taxableSalarySiblingForm: NgForm) {
    document.getElementById('cancel-taxable-salary-sibling-form')?.click();

    //todo clean code

    // this.monthlyService.getTaxableSalarySibling(
    //   taxableSalarySiblingForm.value.netSalary,
    //   taxableSalarySiblingForm.value.netBrutCoefficient,
    //   taxableSalarySiblingForm.value.maintenanceCost)
    //   .subscribe(
    //     (response: number) => {
    //       this.taxableSalarySibling = response
    //       console.log(response);
    //       taxableSalarySiblingForm.reset();
    //     }
    //   );

    this.monthlyService.getTaxableSalarySibling(
      taxableSalarySiblingForm.value.netSalary,
      taxableSalarySiblingForm.value.netBrutCoefficient,
      taxableSalarySiblingForm.value.maintenanceCost)
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

  public onUpdateChild(child: Child): void {
    // todo clean code
    // this.childService.updateChild(child).subscribe(
    //   (response: Child) => {
    //     console.log(response);
    //     this.getChildren();
    //   }
    // );

    this.childService.updateChild(child).subscribe({
      next: childUpdated => {
        console.log(childUpdated);
        this.getChildren();
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public onDeleteChild(childId: number): void {
    // console.log("childId: " + childId); todo clean code
    // this.childService.deleteChild(childId).subscribe(
    //   (response: void) => {
    //     console.log("message de suppresion: " + response);
    //     this.getChildren();
    //   }
    // );

    this.childService.deleteChild(childId).subscribe({
      next: childDeleted => {
        console.log(childDeleted);
        this.getChildren();
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }

    );
  }

  public searchChild(key: string): void {
    const results: Child[] = [];
    this.getChildren();
    setTimeout(() => {
      this.children.forEach((child) => {
        if (child.firstname.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || child.lastname.toLowerCase().indexOf(key.toLowerCase()) !== -1
        ) {
          results.push(child);
        }
      }
      )
      this.children = results;
      if (results.length === 0 || !key) {
        this.getChildren();
      }
    }, 100);
  }

  public onOpenModel(monthly: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addChildModal');
    }
    if (mode === 'edit') {
      this.editChild = monthly;
      button.setAttribute('data-target', '#updateChildModal');
    }
    if (mode === 'delete') {
      this.deleteChild = monthly;
      button.setAttribute('data-target', '#deleteChildModal');
    }
    if (mode === "addMonthly") {
      this.childId = monthly;
      button.setAttribute('data-target', '#addMonthlyModal');
    }
    if (mode === "taxableSalarySibling") {
      button.setAttribute('data-target', '#taxableSalarySiblingModal');
    }
    container?.appendChild(button);
    button.click();
  }
}


