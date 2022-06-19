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
  public editMonthlyForm!: FormGroup;
  public taxableSalarySiblingForm!: FormGroup;


  constructor(
    private monthlyService: MonthlyService,
    private route: ActivatedRoute,
    private childService: ChildService,
    public appComponent: AppComponent,
    private fb: FormBuilder,
  ) {
    this.calculAbatementMonthlyComponent = new CalculAbatementMonthlyComponent(
      monthlyService, appComponent, childService, fb);
    this.calculAbatementHomeComponent = new CalculAbatementHomeComponent(childService, monthlyService, appComponent, fb);
  }

  public page: number = 1;
  public childDetails!: Child;
  public editMonthly!: Monthly;
  public deleteMonthly!: Monthly;
  public addMonthlyChild!: Monthly;
  public taxableSalarySibling!: number;

  public errorMsg!: String;
  public errorsValidation!: String;
  
  public months!: String[];
  public sumTaxableSalary!: number;
  public sumDaysWorked!: number;
  public sumHoursWorked!: number;
  public sumLunches!: number;
  public sumSnacks!: number;

  public validationErrorsMessages: any = {
    required: "Ce champ est requis",
    min: "Le nombre ne peut être inferieur à 0",
    max: "Le nombre est trop grand",
    minlength: "L\' année doit contenir 4 caractères min",
    maxlength: "L\' année doit contenir 4 caractères max",
    pattern: "Uniquement les nombres sont acceptés"
  };



  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('childId')!;
    this.getChildDetails(id);
    this.calculAbatementMonthlyComponent.getMonths();

    this.getAddMonthlyInChildDetailsForm();
    this.getEditMonthlyForm();
    this.getTaxableSalarySiblingFrom();
  }

  public formControlsValueChange(fromControl: AbstractControl | null): void {
    fromControl?.valueChanges.subscribe(value => {
      console.log(value);
      this.setMessage(fromControl);

    });
  }

  private setMessage(value: AbstractControl): void {
    this.errorsValidation = '';

    if ((value.touched || value.dirty || value.untouched || value.pristine) && value.errors) {
      console.log(Object.keys(value.errors));
      this.errorsValidation = Object.keys(value.errors).map(
        key => this.validationErrorsMessages[key]).join(' ');

      console.log("mon erreur:" + this.errorsValidation);

    }
  }

  public getTaxableSalarySiblingFrom(): void {
    this.taxableSalarySiblingForm = this.fb.group({
      netSalary: [null, [Validators.required, Validators.min(0), Validators.max(10000)]],
      maintenanceCost: [null, [Validators.required, Validators.min(0), Validators.max(1500)]],
      netBrutCoefficient: [0.7801, [Validators.required, Validators.pattern(/^\d+\.\d{4}$/)]]
    });

    const netSalaryControl = this.taxableSalarySiblingForm.get('netSalary');
    const maintenanceCostControl = this.taxableSalarySiblingForm.get('maintenanceCost');
    const netBrutCoefficientControl = this.taxableSalarySiblingForm.get('netBrutCoefficient');

    this.formControlsValueChange(netSalaryControl);
    this.formControlsValueChange(maintenanceCostControl);
    this.formControlsValueChange(netBrutCoefficientControl);

  }



  public getAddMonthlyInChildDetailsForm(): void {
    this.addMonthlyInChildDetailsForm = this.fb.group({
      month: ["", [Validators.required]],
      year: [this.appComponent.currentYear,
      [Validators.required, Validators.minLength(4), Validators.maxLength(4),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      taxableSalary: ["",
        [Validators.required, Validators.min(0), Validators.max(10000)]],
      dayWorked: [null,
        [Validators.required, Validators.min(0), Validators.max(31)]],

      hoursWorked: [null,
        [Validators.min(0), Validators.max(350)]],

      lunch: [null,
        [Validators.min(0), Validators.max(100)]],

      snack: [null,
        [Validators.min(0), Validators.max(100)]],
      childId: 'this.childDetails.id'
    });

    const monthControl = this.addMonthlyInChildDetailsForm.get('month');
    const yearControl = this.addMonthlyInChildDetailsForm.get('year');
    const taxableSalaryControl = this.addMonthlyInChildDetailsForm.get('taxableSalary');
    const dayWorkedControl = this.addMonthlyInChildDetailsForm.get('dayWorked');
    const hoursWorkedControl = this.addMonthlyInChildDetailsForm.get('hoursWorked');
    const lunchControl = this.addMonthlyInChildDetailsForm.get('lunch');
    const snackControl = this.addMonthlyInChildDetailsForm.get('snack');

    this.formControlsValueChange(monthControl);
    this.formControlsValueChange(yearControl);
    this.formControlsValueChange(taxableSalaryControl);
    this.formControlsValueChange(dayWorkedControl);
    this.formControlsValueChange(hoursWorkedControl);
    this.formControlsValueChange(lunchControl);
    this.formControlsValueChange(snackControl);
  }

  public getEditMonthlyForm(): void {
    this.editMonthlyForm = this.fb.group({

      monthlyId: [""],
      month: ["", [Validators.required]],
      year: [this.appComponent.currentYear,
      [Validators.required, Validators.minLength(4), Validators.maxLength(4),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      taxableSalary: ["",
        [Validators.required, Validators.min(0), Validators.max(10000)]],
      dayWorked: [null,
        [Validators.required, Validators.min(0), Validators.max(31)]],

      hoursWorked: [null,
        [Validators.min(0), Validators.max(350)]],

      lunch: [null,
        [Validators.min(0), Validators.max(100)]],

      snack: [null,
        [Validators.min(0), Validators.max(100)]],
      childId: [""]
    });

    // const monthlyId = this.editMonthlyForm.get('monthlyId');
    const monthControl = this.editMonthlyForm.get('month');
    const yearControl = this.editMonthlyForm.get('year');
    const taxableSalaryControl = this.editMonthlyForm.get('taxableSalary');
    const dayWorkedControl = this.editMonthlyForm.get('dayWorked');
    const hoursWorkedControl = this.editMonthlyForm.get('hoursWorked');
    const lunchControl = this.editMonthlyForm.get('lunch');
    const snackControl = this.editMonthlyForm.get('snack');

    // this.formControlsValueChange(monthlyId);
    this.formControlsValueChange(monthControl);
    this.formControlsValueChange(yearControl);
    this.formControlsValueChange(taxableSalaryControl);
    this.formControlsValueChange(dayWorkedControl);
    this.formControlsValueChange(hoursWorkedControl);
    this.formControlsValueChange(lunchControl);
    this.formControlsValueChange(snackControl);

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
        this.errorMsg = "La déclaration mensuelle pour: "
          + this.addMonthlyInChildDetailsForm.value.month + " " + this.addMonthlyInChildDetailsForm.value.year + " existe déjà!";
      }
    }
    );
  }

  public onCalculateTaxableSalarySibling() {
    document.getElementById('cancel-taxable-salary-sibling-form')?.click();

    this.monthlyService.getTaxableSalarySibling(
      this.taxableSalarySiblingForm.value.netSalary,
      this.taxableSalarySiblingForm.value.netBrutCoefficient,
      this.taxableSalarySiblingForm.value.maintenanceCost)
      .subscribe({
        next: taxableSalarySibling => {
          this.taxableSalarySibling = taxableSalarySibling;
          console.log(taxableSalarySibling);

          this.addMonthlyInChildDetailsForm.patchValue({
            taxableSalary: this.taxableSalarySibling
          });
          this.taxableSalarySiblingForm.reset();
        },
        error: err => {
          this.errorMsg = err.message;
        }
      }
      );
  }


  public onUpdateMonthly(): void {
    // console.log(JSON.stringify( this.editMonthlyForm.value));
    this.monthlyService.updateMonthly(this.editMonthlyForm.value).subscribe({
      next: monthly => {
        console.log(monthly);
        this.editMonthlyForm.patchValue({
          monthlyId: this.editMonthly.monthlyId,
          childId: this.editMonthly.childId
        });
        this.getChildDetails(monthly.childId);
      },
      error: err => {
        this.errorMsg = err.message;
        this.errorMsg = "La déclaration mensuelle pour: "
          + this.editMonthlyForm.value.month + " " + this.editMonthlyForm.value.year + " existe déjà!";
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

  public onGetMonthliesByYearAndChildId(filterMonthliesForm: NgForm): void {
    this.monthlyService.getMonthliesByYearAndChildId(filterMonthliesForm.value.year, this.childDetails.id).subscribe(
      {
        next: monthlies => {
          this.childDetails.monthlies = monthlies;
          console.log(monthlies);
          if (!monthlies.length) {
            this.errorMsg = "Aucune déclaration enregistré en: "
              + filterMonthliesForm.value.year;
          }

          if (this.childDetails.monthlies.some(monthly => monthly.year === filterMonthliesForm.value.year)
          ) {
            this.getTaxRelief(this.childDetails, filterMonthliesForm.value.year);
            this.getAnnualReportableAmounts(this.childDetails, filterMonthliesForm.value.year);
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

  public hideError(): void {
    this.errorMsg = '';
  }

  public setUpdateMonthlyModalValues(): void {
    this.editMonthlyForm.setValue({
      monthlyId: this.editMonthly.monthlyId,
      month: this.editMonthly.month,
      year: this.editMonthly.year,
      taxableSalary: this.editMonthly.taxableSalary,
      dayWorked: this.editMonthly.dayWorked,
      hoursWorked: this.editMonthly.hoursWorked,
      lunch: this.editMonthly.lunch,
      snack: this.editMonthly.snack,
      childId: this.editMonthly.childId
    })
  }

  public onOpenModel(monthly: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'editMonthly') {
      this.editMonthly = monthly;
      this.setUpdateMonthlyModalValues();

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
