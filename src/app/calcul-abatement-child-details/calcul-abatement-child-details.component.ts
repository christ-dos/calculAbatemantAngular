import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  public addMonthlyInChildDetailsForm!: FormGroup;


  constructor(
    private monthlyService: MonthlyService,
    private route: ActivatedRoute,
    private childService: ChildService,
    public appComponent: AppComponent,
    private fb: FormBuilder,
  ) {
    this.calculAbatementMonthlyComponent = new CalculAbatementMonthlyComponent(
      monthlyService, appComponent, childService);
    this.calculAbatementHomeComponent = new CalculAbatementHomeComponent(childService, monthlyService, appComponent);
  }

  public page: number = 1;
  public childDetails!: Child;
  //public childId!: string;
  public editMonthly!: Monthly;
  public deleteMonthly!: Monthly;
  public addMonthlyChild!: Monthly;

  public errorMsg!: String;
  public errorsValidation!: String;
  //public taxableSalarySibling!: number; à implementer

  public months!: String[];
  //public monthliesFiltered!: Monthly[];
  //public monthliesByChildIdOrderedByYearDescAndMonthDesc!: Monthly[]; todo clean code

  public sumTaxableSalary!: number;
  public sumDaysWorked!: number;
  public sumHoursWorked!: number;
  public sumLunches!: number;
  public sumSnacks!: number;

  public validationErrorsMessages: any = {
    required: "Ce champ est requis",
    min: "Le nombre ne peut être inferieur à 0",
    max: "Le nombr est trop grand",
    minlength: "L\'année doit contenir 4 caractères au minimum",
    maxlength: "L\'année doit contenir 4 caractères au maximum",
  
  };



  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('childId')!;
    this.getChildDetails(id);
    this.calculAbatementMonthlyComponent.getMonths();

    this.addMonthlyInChildDetailsForm = this.fb.group({
      month: ["", [Validators.required]],
      year: [this.appComponent.currentYear,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      taxableSalary: ['this.taxableSalarySibling',
        [Validators.required, Validators.min(0), Validators.max(10000)]],
      dayWorked: [null,
        [Validators.required, Validators.min(0), Validators.max(31)]],

      hoursWorked: [null,
        [Validators.min(0), Validators.max(500)]],

      lunch: [null,
        [Validators.min(0), Validators.max(100)]],

      snack: [null,
        [Validators.min(0), Validators.max(100)]],
      childId: 'this.childDetails.id'

    });

    const monthControl = this.addMonthlyInChildDetailsForm.get('month');
    const yearControl = this.addMonthlyInChildDetailsForm.get('year');
    
    monthControl?.valueChanges.subscribe(value => {
      console.log(value);
      this.setMessage(monthControl);
    
    });

    yearControl?.valueChanges.subscribe(value=> {
      console.log(value);
      this.setMessage(yearControl);
    
    });

  }

  private setMessage(value: AbstractControl): void{
    this.errorsValidation = '';

    if((value.touched || value.dirty || value.pristine) && value.errors){
      console.log(Object.keys(value.errors));
      this.errorsValidation = Object.keys(value.errors).map(
        key => this.validationErrorsMessages[key]).join(' ');

        console.log("mon erreur:" + this.errorsValidation);

    }
  }


  public getChildDetails(id: number): void {
    this.childService.getChildById(id).subscribe({
      next: child => {
        this.childDetails = child;
        console.log(child);
        this.getMonthliesByChildIdOrderByYearDescAndMonthDesc(id)

        if (this.childDetails.monthlies?.some(monthly => monthly.year === this.appComponent.currentYear)) {
          this.calculAbatementHomeComponent.getTaxableSalary(child, this.appComponent.currentYear);
          this.calculAbatementHomeComponent.getTaxRelief(child, this.appComponent.currentYear);
          this.calculAbatementHomeComponent.getAnnualReportableAmounts(child, this.appComponent.currentYear);
          this.calculAbatementMonthlyComponent.getMonths();

        } else {
          this.childDetails.taxableSalary = 0;
          this.childDetails.taxRelief = 0;
          this.childDetails.reportableAmounts = 0;
        }

      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public onAddMonthly(): void {
    document.getElementById('cancel-add-Monthly-form')?.click();
    this.addMonthlyInChildDetailsForm.controls['childId'].setValue(this.childDetails.id);
    //console.log(this.addMonthlyInChildDetailsForm);
    this.monthlyService.addMonthly(this.addMonthlyInChildDetailsForm.value).subscribe({
      next: monthly => {
        console.log(monthly);
        this.getChildDetails(this.addMonthlyInChildDetailsForm.value.childId);
        this.addMonthlyInChildDetailsForm.reset();
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
        this.getChildDetails(monthly.childId);
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public onDeleteMonthly(monthlyId: number): void {
    this.monthlyService.deleteMonthly(monthlyId).subscribe({
      next: message => {
        console.log(message);
        document.getElementById('search-monthlies')?.click();
        this.getChildDetails(this.deleteMonthly.childId);
        
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );

  }

  public getMonthliesByChildIdOrderByYearDescAndMonthDesc(childDetailId: number): void {
    this.monthlyService.getMonthliesByChildIdOrderByYearDescAndMonthDesc(childDetailId).subscribe({
      next: monthlies => {
        console.log(monthlies);
        this.childDetails.monthlies = monthlies;
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }

    );
  }

  public onGetMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm: NgForm): void {
    this.monthlyService.getMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm.value.year, this.childDetails.id).subscribe(
      {
        next: monthlies => {
          this.childDetails.monthlies = monthlies;
          console.log(monthlies);

          if (this.childDetails.monthlies.some(monthly => monthly.year === monthliesByYearAndByChildIdForm.value.year)
          ) {
            this.getTaxRelief(this.childDetails, monthliesByYearAndByChildIdForm.value.year);
            this.getAnnualReportableAmounts(this.childDetails, monthliesByYearAndByChildIdForm.value.year);
          } else {
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
        },
        error: err => {
          this.errorMsg = err.message;
        }
      }
    );

  }

  public getAnnualReportableAmounts(child: Child, year: String): void {
    this.childService.getAnnualReportableAmounts(child.id, year).subscribe({
      next: annualReportableAmounts => {
        console.log(annualReportableAmounts);
        this.childDetails.reportableAmounts = annualReportableAmounts;
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public getTaxRelief(child: Child, year: String): void {
    this.childService.getTaxRelief(child.id, year).subscribe({
      next: taxRelief => {
        console.log(taxRelief);
        this.childDetails.taxRelief = taxRelief;
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }

  public hideError(): void{
    this.errorMsg = '';
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
