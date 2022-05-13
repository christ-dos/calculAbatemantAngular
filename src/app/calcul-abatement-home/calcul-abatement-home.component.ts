

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm} from '@angular/forms';
import {jsPDF } from 'jspdf';
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
        monthlyService,appComponent,childService);    
    }

    public children!: Child[];
    public editChild!: Child;
    public deleteChild!: Child;
    public feesChild!: Child;
   
    public taxableSalary!: number;
    public taxableSalarySibling!: number;
    public reportableAmounts!: number;
    public taxRelief!: number;

    public childId!:number;
    public addMonthlyChild!: Child;
    public monthSelected!: String;

    public sumTaxRelief!: number;
    public sumReportableAmount!: number;
    public sumTaxableSalary!:number;
    public summaryYear!: String;

    public yearPrecedingCurrentYear: String = new String(new Date().getFullYear() -1);
    public erroMessage!: String;
    public currentYear: String = this.appComponent.currentYear;

    public selectedFile!: File;
    public urlLink!: string;
    
    @ViewChild('content', {static: false}) 
    public el!: ElementRef;



  ngOnInit(): void {
   this.getChildren();
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe(
      (response: Child[]) => {
        console.log(response);
        this.children = response;
        this.calculAbatementMonthlyComponent.getMonths();
        this.children.forEach((child) => {
          if(child.monthlies.length > 0 || child.endContract == null){
            console.log("je suis dans le if" + child.firstname); //todo clean code
            this.getTaxableSalary(child, this.appComponent.currentYear);
            this.getAnnualReportableAmounts(child,this.appComponent.currentYear);
            this.getTaxRelief(child,this.appComponent.currentYear);
          }
        });
      }
    )
  }

  public getTaxableSalary(child: Child, year: String): void {
    this.childService.getTaxableSalary(child.id, year).subscribe({
      next: taxableSalary =>{
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

  public getAnnualReportableAmounts(child: Child,  year: String): void {
    this.childService.getAnnualReportableAmounts(child.id, year).subscribe(
    (response: number) => {
       console.log(response);
       this.reportableAmounts = response;
       child.reportableAmounts = this.reportableAmounts;
      }
    )
  }

  public getTaxRelief(child: Child,  year: String): void {
    this.childService.getTaxRelief(child.id, year).subscribe(
      (response: number) => {
        console.log(response);
        this.taxRelief = response;
        child.taxRelief = this.taxRelief;
      }
    )
  }

  public onSummaryModal(year:String): void{
    this.currentYear = year;

    this.children.forEach((child) => {
    this.getTaxableSalary(child, year);
    this.getTaxRelief(child,year);
    this.getAnnualReportableAmounts(child, year);
    });

    setTimeout(() => {
      this.sumTaxableSalary = this.children.reduce((accumulator, child) => {
        return accumulator + child.taxableSalary;
      }, 0); 
      }, 100);

    setTimeout(() => {
      this.sumTaxRelief = this.children.reduce((accumulator, child) => {
        return accumulator + child.taxRelief;
      }, 0);
    }, 400);
    setTimeout(() => {
      this.sumReportableAmount = this.children.reduce((accumulator, child) => {
        return accumulator + child.reportableAmounts;
      }, 0);
    }, 600);
  }

  public onSelectImage(event: any):void{
  
    this.selectedFile = <File> event.target.files[0];
  
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
      taxableSalarySiblingForm.value.netSalary,
      taxableSalarySiblingForm.value.netBrutCoefficient,
      taxableSalarySiblingForm.value.maintenanceCost)
    .subscribe(
      (response: number) => {
        this.taxableSalarySibling = response
        console.log(response);
        taxableSalarySiblingForm.reset();
  }
  );
}

  public onMakePdf(): void{
    let pdf = new jsPDF('p','pt','a4'); 
    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        pdf.save('child.pdf');
      }
    });
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
    console.log("childId: " + childId);
    this.childService.deleteChild(childId).subscribe(
      (response: void) => {
        console.log("message de suppresion: " + response);
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


