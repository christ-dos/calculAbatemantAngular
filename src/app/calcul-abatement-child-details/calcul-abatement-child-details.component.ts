import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { AppComponent } from '../app.component';
import { CalculAbatementHomeComponent } from '../calcul-abatement-home/calcul-abatement-home.component';
import { CalculAbatementMonthlyComponent } from '../calcul-abatement-monthly/calcul-abatement-monthly.component';
import { Child } from '../models/child.model';
import { Monthly } from '../models/monthly.model';
import { ChildService } from '../services/child.service';
import { MonthlyService } from '../services/monthly.service';

@Component({
  selector: 'app-calcul-abatement-child-details',
  templateUrl: './calcul-abatement-child-details.component.html',
  styleUrls: ['./calcul-abatement-child-details.component.css']
})
export class CalculAbatementChildDetailsComponent implements OnInit {
  public calculAbatementMonthlyComponent!: CalculAbatementMonthlyComponent;
  public calculAbatementHomeComponent!: CalculAbatementHomeComponent;
  

  constructor(
    private monthlyService: MonthlyService, 
    private route: ActivatedRoute,
    private childService: ChildService,
    public appComponent: AppComponent,
  ) { 
    this.calculAbatementMonthlyComponent = new CalculAbatementMonthlyComponent(
      monthlyService,appComponent,childService);
    this.calculAbatementHomeComponent = new CalculAbatementHomeComponent(childService,monthlyService,appComponent);
    
  }

  public page: number = 1;
  public childDetails!: Child;
  public childId!: string;

  public errorMsg!: String;
  public taxableSalarySibling!:number;

  public monthSelected!: String;
  public monthliesFiltered!: Monthly[];
  public monthliesByChildIdOrderedByYearDescAndMonthDesc!: Monthly[];
  
  public sumTaxableSalary!: number;
  public sumDaysWorked!: number;
  public sumHoursWorked!: number;
  public sumLunches!: number;
  public sumSnacks!: number;
 

  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('childId')!;
    this.getChildDetails(id);
  }

  public getChildDetails(id: number): void{
    this.childService.getChildById(id).subscribe({
      next: child =>{
       // const yearPrecedingCurrentYear = new String(new Date().getFullYear() -1);
        this.childDetails = child;
        this.getMonthliesByChildIdOrderByYearDescAndMonthDesc(id)

        const result = this.childDetails.monthlies.some(monthly => monthly.year === this.appComponent.currentYear);
        if(result){
          this.calculAbatementHomeComponent.getTaxableSalary(child, this.appComponent.currentYear);
          this.calculAbatementHomeComponent.getTaxRelief(child, this.appComponent.currentYear);
          this.calculAbatementHomeComponent.getAnnualReportableAmounts(child, this.appComponent.currentYear);
          this.calculAbatementMonthlyComponent.getMonths();
          console.log("childDetails: " + child);
        }else{
          this.childDetails.taxableSalary = 0;
          this.childDetails.taxRelief = 0;
          this.childDetails.reportableAmounts= 0;
        }
      
      },
      error: err => {
        this.errorMsg = err.message;
        console.log("mon erreur: " + this.errorMsg);
      }
    }
    );
  }

  public onAddMonthly(addMonthlyForm: NgForm): void {
    document.getElementById('cancel-add-Monthly-form')?.click();
    console.log("childDetailId: " + this.childDetails.id);
    console.log("addMonthlyFormBefore: " + addMonthlyForm.value.childId);
    addMonthlyForm.controls['childId'].setValue(this.childDetails.id);
    console.log("addMonthlyFormAfter: " + addMonthlyForm.value.childId);
    //todo clean les console.log
   this.monthlyService.addMonthly(addMonthlyForm.value).subscribe(
      (response: Monthly) => {
        console.log(response);
        this.getChildDetails(addMonthlyForm.value.childId);
        addMonthlyForm.reset();
    
      }
    );
  }

  public getMonthliesByChildIdOrderByYearDescAndMonthDesc(childDetailId: number): void{
    this.monthlyService.getMonthliesByChildIdOrderByYearDescAndMonthDesc(childDetailId).subscribe(
      (response: Monthly[]) => {
         console.log(response);
         this.childDetails.monthlies = response;
        }
      )
    }

  public onGetMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm: NgForm): void{
    this.monthlyService.getMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm.value.year, this.childDetails.id).subscribe(
      (response: Monthly[]) => {
       this.childDetails.monthlies = response;
       console.log(response);

       if(this.childDetails.monthlies.some(monthly => monthly.year === monthliesByYearAndByChildIdForm.value.year)
       ){
          this.getTaxRelief(this.childDetails, monthliesByYearAndByChildIdForm.value.year); 
          this.getAnnualReportableAmounts(this.childDetails, monthliesByYearAndByChildIdForm.value.year);
        }else{
          this.childDetails.taxRelief = 0;
          this.childDetails.reportableAmounts = 0;
        }
      
       this.sumTaxableSalary = this.childDetails.monthlies.reduce((accumulator, monthly) => {
         return accumulator + monthly.taxableSalary;
        }, 0);

       this.childDetails.taxableSalary = this.sumTaxableSalary;
 
       this.sumDaysWorked = this.childDetails.monthlies.reduce((accumulator, monthly) => {
         return accumulator + monthly.dayWorked;
       }, 0);
 
       this.sumHoursWorked = this.childDetails.monthlies.reduce((accumulator, monthly) => {
         return accumulator + monthly.hoursWorked;
       }, 0);
 
       this.sumLunches = this.childDetails.monthlies.reduce((accumulator, monthly) => {
         return accumulator + monthly.lunch;
       }, 0);
 
       this.sumSnacks = this.childDetails.monthlies.reduce((accumulator, monthly) => {
         return accumulator + monthly.snack;
       }, 0);

      
       console.log("sumTaxableSalary: " + this.sumTaxableSalary); // clean code
      // this.getChildDetails(this.childDetails.id);
       
       }
     )
   }

   public getAnnualReportableAmounts(child: Child,  year: String): void {
    this.childService.getAnnualReportableAmounts(child.id, year).subscribe(
    (response: number) => {
       console.log(response);
       this.childDetails.reportableAmounts = response;
      }
    )
  }

  public getTaxRelief(child: Child,  year: String): void {
    this.childService.getTaxRelief(child.id, year).subscribe(
      (response: number) => {
        console.log(response);
        this.childDetails.taxRelief = response;
      }
    )
  }
 


  

}
