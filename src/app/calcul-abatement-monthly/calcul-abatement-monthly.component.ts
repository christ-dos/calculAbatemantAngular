import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
  public addMonthlyModalForm!: FormGroup;
  public editMonthlyForm!: FormGroup;
  public taxableSalarySiblingForm!: FormGroup;

  constructor(
    private monthlyService: MonthlyService,
    public appComponent: AppComponent,
    private childService: ChildService,
    private fb: FormBuilder
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

  public sumTaxableSalary!: number;
  public sumDaysWorked!: number;
  public sumHoursWorked!: number;
  public sumLunches!: number;
  public sumSnacks!: number;

  public errorMsg!: String;
  public errorsValidation!: String;
  public successMsg!: String;

  public validationErrorsMessages: any = {
    required: "Ce champ est requis",
    min: "Le nombre ne peut être inferieur à 0",
    max: "Le nombre est trop grand",
    minlength: "L\' année doit contenir 4 caractères min",
    maxlength: "L\' année doit contenir 4 caractères max",
    pattern: "Uniquement les nombres sont acceptés"
  };

  public valueSelected!: number;

  ngOnInit(): void {
    this.getChildren();
    this.getMonths();
    this.valueSelected = 0;

    this.getAddMonthlyForm();
    this.getEditMonthlyForm();
    this.getTaxableSalarySiblingFrom();
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

  public getAddMonthlyForm(): void {
    this.addMonthlyModalForm = this.fb.group({
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
      childId: [this.childId]
    });

    const monthControl = this.addMonthlyModalForm.get('month');
    const yearControl = this.addMonthlyModalForm.get('year');
    const taxableSalaryControl = this.addMonthlyModalForm.get('taxableSalary');
    const dayWorkedControl = this.addMonthlyModalForm.get('dayWorked');
    const hoursWorkedControl = this.addMonthlyModalForm.get('hoursWorked');
    const lunchControl = this.addMonthlyModalForm.get('lunch');
    const snackControl = this.addMonthlyModalForm.get('snack');

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

    const monthControl = this.editMonthlyForm.get('month');
    const yearControl = this.editMonthlyForm.get('year');
    const taxableSalaryControl = this.editMonthlyForm.get('taxableSalary');
    const dayWorkedControl = this.editMonthlyForm.get('dayWorked');
    const hoursWorkedControl = this.editMonthlyForm.get('hoursWorked');
    const lunchControl = this.editMonthlyForm.get('lunch');
    const snackControl = this.editMonthlyForm.get('snack');

    this.formControlsValueChange(monthControl);
    this.formControlsValueChange(yearControl);
    this.formControlsValueChange(taxableSalaryControl);
    this.formControlsValueChange(dayWorkedControl);
    this.formControlsValueChange(hoursWorkedControl);
    this.formControlsValueChange(lunchControl);
    this.formControlsValueChange(snackControl);
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
      console.log(this.errorsValidation);
    }
  }

  public hideError(errorToHide: String): void {
    if (errorToHide === "errorMsg") {
      this.errorMsg = '';
    }
    this.successMsg = '';
  }

  public onGetMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm: NgForm): void {
    if (monthliesByYearAndByChildIdForm.value.selectChild === "Choisir") {
      this.errorMsg = "Veuillez choisir un enfant"
    } else {
      this.monthlyService.getMonthliesByYearAndChildId(monthliesByYearAndByChildIdForm.value.year, this.childId).subscribe(
        {
          next: monthlies => {
            this.monthlies = monthlies;
            console.log(monthlies);

            if (!monthlies.length) {
              this.errorMsg = "Aucun déclaration mensuelle trouvé pour l'année: "
                + monthliesByYearAndByChildIdForm.value.year;
            }

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

            this.getChildren();
          },
          error: err => {
            this.errorMsg = err.message;
          }
        }
      );
    }
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

  public getMonths(): void {
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

  public onAddMonthly(): void {
    document.getElementById('cancel-add-Monthly-form')?.click();
    this.addMonthlyModalForm.controls['childId'].setValue(this.childId);

    if (this.addMonthlyModalForm.value.childId === "Choisir") {
      this.errorMsg = "Veuillez choisir un enfant"
    } else {
      this.monthlyService.addMonthly(this.addMonthlyModalForm.value).subscribe({
        next: monthly => {
          console.log(monthly);
          this.getMonthliesByYearAndChildId(this.addMonthlyModalForm.value.year,
            this.addMonthlyModalForm.value.childId)
          this.successMsg = "Déclaration mensuelle ajouté avec succés pour "
            + this.addMonthlyModalForm.value.month + " " + this.addMonthlyModalForm.value.year;

          this.addMonthlyModalForm.reset();
          document.getElementById('search-monthlies')?.click();
        },
        error: err => {
          this.errorMsg = err.message;
        }
      }
      );
    }
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

          this.addMonthlyModalForm.patchValue({
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
    this.monthlyService.updateMonthly(this.editMonthlyForm.value).subscribe({
      next: monthly => {
        console.log(monthly);

        this.editMonthlyForm.patchValue({
          monthlyId: this.editMonthly.monthlyId,
          childId: this.editMonthly.childId
        });

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
    });
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
