

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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

  public addMonthlyForm!: FormGroup;
  public taxableSalarySiblingForm!: FormGroup;
  public editChildForm!: FormGroup;

  constructor(
    private childService: ChildService,
    private monthlyService: MonthlyService,
    public appComponent: AppComponent,
    private fb: FormBuilder,
  ) {
    this.calculAbatementMonthlyComponent = new CalculAbatementMonthlyComponent(
      monthlyService, appComponent, childService, fb);
  }

  public page: number = 1;
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

  public sumTaxRelief!: number;
  public sumReportableAmount!: number;
  public sumTaxableSalary!: number;
  public summaryYear!: String;

  public yearPrecedingCurrentYear: String = new String(new Date().getFullYear() - 1);
  public months!: String[];
  public currentYear: String = this.appComponent.currentYear;
  public currentMonth!: String;

  public selectedFile!: File;
  public urlLink!: string;

  public errorMsg!: String;
  public successMsg!: String;
  public errorsValidation!: String;

  public validationErrorsMessages: any = {
    required: "Ce champ est requis",
    min: "Le nombre ne peut être inferieur à 0",
    max: "Le nombre est trop grand",
    minlength: "L\' année doit contenir 4 caractères min",
    maxlength: "L\' année doit contenir 4 caractères max",
    pattern: "Uniquement les nombres sont acceptés"
  };

  @ViewChild('content', { static: false })
  public el!: ElementRef;

  ngOnInit(): void {
    this.getChildren();
    this.getMonths()

    this.getAddMonthlyForm();
    this.getTaxableSalarySiblingFrom();
    this. getEditChildForm();

  }

  public getEditChildForm(): void {
    this.editChildForm = this.fb.group({
      id: [""],
      lastname: ["", [Validators.required, Validators.minLength(2),
         Validators.maxLength(30), Validators.pattern(/^[a-zA-Z ]+$/)]],
      firstname: ["", [Validators.required, Validators.minLength(2),
         Validators.maxLength(30), Validators.pattern(/^[a-zA-Z ]+$/)]],
      birthDate: ["",
        [Validators.required,
        Validators.pattern(/^(?:(?:(?:0[1-9]|[12]\d|3[01])\/(?:0[13578]|1[02])|(?:0[1-9]|[12]\d|30)\/(?:0[469]|11)|(?:0[1-9]|1\d|2[0-8])\/02)\/(?!0000)\d{4}|(?:(?:0[1-9]|[12]\d)\/02\/(?:(?!0000)(?:[02468][048]|[13579][26])00|(?!..00)\d{2}(?:[02468][048]|[13579][26]))))$/)]],
      beginContract: ["",
        [Validators.required,
        Validators.pattern(/^(?:(?:(?:0[1-9]|[12]\d|3[01])\/(?:0[13578]|1[02])|(?:0[1-9]|[12]\d|30)\/(?:0[469]|11)|(?:0[1-9]|1\d|2[0-8])\/02)\/(?!0000)\d{4}|(?:(?:0[1-9]|[12]\d)\/02\/(?:(?!0000)(?:[02468][048]|[13579][26])00|(?!..00)\d{2}(?:[02468][048]|[13579][26]))))$/)]],
      endContract: ["",
        [Validators.pattern(/^(?:(?:(?:0[1-9]|[12]\d|3[01])\/(?:0[13578]|1[02])|(?:0[1-9]|[12]\d|30)\/(?:0[469]|11)|(?:0[1-9]|1\d|2[0-8])\/02)\/(?!0000)\d{4}|(?:(?:0[1-9]|[12]\d)\/02\/(?:(?!0000)(?:[02468][048]|[13579][26])00|(?!..00)\d{2}(?:[02468][048]|[13579][26]))))$/)]],
      feesLunch: [null,
        [Validators.min(0), Validators.max(50)]],
      feesSnack: [null,
        [Validators.min(0), Validators.max(50)]],
      imageUrl: ["", [Validators.required, Validators.pattern(/^[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?$/)]]
    });

    const lastnameControl = this.editChildForm.get('lastname');
    const firstnameControl = this.editChildForm.get('firstname');
    const birthDateControl = this.editChildForm.get('birthDate');
    const beginContractControl = this.editChildForm.get('beginContract');
    const endContractControl = this.editChildForm.get('endContract');
    const feesLunchControl = this.editChildForm.get('feesLunch');
    const feesSnackControl = this.editChildForm.get('feesSnack');
    const imageUrlControl = this.editChildForm.get('imageUrl');

    this.formControlsValueChange(lastnameControl);
    this.formControlsValueChange(firstnameControl);
    this.formControlsValueChange(birthDateControl);
    this.formControlsValueChange(beginContractControl);
    this.formControlsValueChange(endContractControl);
    this.formControlsValueChange(feesLunchControl);
    this.formControlsValueChange(feesSnackControl);
    this.formControlsValueChange(imageUrlControl);
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
    this.addMonthlyForm = this.fb.group({
      month: ["", [Validators.required]],
      year: ["",
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

    const monthControl = this.addMonthlyForm.get('month');
    const yearControl = this.addMonthlyForm.get('year');
    const taxableSalaryControl = this.addMonthlyForm.get('taxableSalary');
    const dayWorkedControl = this.addMonthlyForm.get('dayWorked');
    const hoursWorkedControl = this.addMonthlyForm.get('hoursWorked');
    const lunchControl = this.addMonthlyForm.get('lunch');
    const snackControl = this.addMonthlyForm.get('snack');

    this.formControlsValueChange(monthControl);
    this.formControlsValueChange(yearControl);
    this.formControlsValueChange(taxableSalaryControl);
    this.formControlsValueChange(dayWorkedControl);
    this.formControlsValueChange(hoursWorkedControl);
    this.formControlsValueChange(lunchControl);
    this.formControlsValueChange(snackControl);
  }

  public formControlsValueChange(formControl: AbstractControl | null): void {
    formControl?.valueChanges.subscribe(value => {
      console.log(value);
      this.setMessage(formControl);

    });
  }

  private setMessage(value: AbstractControl): void {
    this.errorsValidation = '';

    if ((value.touched || value.dirty || value.untouched || value.pristine) && value.errors) {
      console.log(Object.keys(value.errors));
      this.errorsValidation = Object.keys(value.errors).map(
        key => this.validationErrorsMessages[key]).join(' ');
    }
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe({
      next: children => {
        console.log(children);
        this.children = children;

        if (!children.length) {
          this.errorMsg = "Aucun enfant trouvé !"
        }
        this.calculAbatementMonthlyComponent.getMonths();
        this.children.forEach((child) => {
          if (child.monthlies?.some(monthly => monthly.year === this.appComponent.currentYear)) {
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

  public getMonths(): void {
    this.monthlyService.getMonths().subscribe({
      next: months => {
        console.log(months);
        this.months = months;

        const currentMonthNumber = this.appComponent.currentMonth;
        this.currentMonth = this.months[currentMonthNumber];
        console.log(this.currentMonth);
      },
      error: err => {
        this.errorMsg = err.message;
      }
    }
    );
  }


  public getTaxableSalary(child: Child, year: String): void {
    this.childService.getTaxableSalary(child.id, year).subscribe({
      next: taxableSalary => {
        this.taxableSalary = taxableSalary;
        child.taxableSalary = this.taxableSalary;
      },
      error: err => {
        this.errorMsg = err;
      }
    }
    );
  }

  public getAnnualReportableAmounts(child: Child, year: String): void {
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
      if (child.monthlies?.some(monthly => monthly.year === year)) {
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

  public onAddMonthly(): void {
    document.getElementById('cancel-add-Monthly-form')?.click();
    this.addMonthlyForm.controls['childId'].setValue(this.addMonthlyChild.id);

    this.monthlyService.addMonthly(this.addMonthlyForm.value).subscribe({
      next: monthly => {
        console.log(monthly);
        this.successMsg = "Déclaration Mensuelle: " + this.addMonthlyForm.get('month')?.value + " " + this.addMonthlyForm.value.year + " ajouté avec succés pour: "
          + this.addMonthlyChild?.firstname.toUpperCase() + " " + this.addMonthlyChild?.lastname.toUpperCase() + "!";
        this.childService.getChildById(monthly.childId).subscribe({
          next: childById => {
            console.log(childById);
            this.addMonthlyChild = childById;
          },
          error: err => {
            this.errorMsg = err;
          }
        });
        this.getChildren();
        this.addMonthlyForm.reset();
      }, error: err => {
          this.errorMsg = err.message;
      }
    });
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

          this.addMonthlyForm.patchValue({
            taxableSalary: this.taxableSalarySibling
          });
          this.taxableSalarySiblingForm.reset();
        },
        error: err => {
          this.errorMsg = err.message;
        }
      });
  }

  public onUpdateChild(): void {
    if (this.editChildFormDatesIsValid()) {
      this.editChildForm.patchValue({
        firstname: this.editChildForm.value.firstname.toLowerCase(),
        lastname: this.editChildForm.value.lastname.toLowerCase(),
      });
      this.childService.updateChild(this.editChildForm.value).subscribe({
        next: childUpdated => {
          console.log(childUpdated);
          this.successMsg = "Enfant: " + childUpdated.firstname.toUpperCase() + " " + childUpdated.lastname.toUpperCase() + " a été mis à jour avec succès!"
          this.getChildren();
        },
        error: err => {
          this.errorMsg = err.message;
        }
      });
    }
  }

  public onDeleteChild(childId: number): void {
    this.childService.deleteChild(childId).subscribe({
      next: childDeleted => {
        console.log(childDeleted);
        this.getChildren();
      },
      error: err => {
        this.errorMsg = err.message;
      }
    });
  }

  public searchChild(key: string): void {
    const results: Child[] = [];
    this.getChildren();
    setTimeout(() => {
      this.children.forEach((child) => {
        if (child.firstname.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || child.lastname.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(child);
        }
      });
      this.children = results;
      if (results.length === 0 || !key) {
        this.getChildren();
      }
    }, 100);
  }

  public hideError(errorToHide: String): void {
    console.log(errorToHide);
    if (errorToHide === "errorMsg") {
      this.errorMsg = '';
    }
    this.successMsg = '';
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
      this.setUpdateChildModalValues();
      button.setAttribute('data-target', '#updateChildModal');
    }
    if (mode === 'delete') {
      this.deleteChild = monthly;
      button.setAttribute('data-target', '#deleteChildModal');
    }
    if (mode === "addMonthly") {
      this.addMonthlyChild = monthly;
      button.setAttribute('data-target', '#addMonthlyModal');

      this.addMonthlyForm.patchValue({
        month: this.currentMonth,
        year: this.currentYear
      });
    }
    if (mode === "taxableSalarySibling") {
      button.setAttribute('data-target', '#taxableSalarySiblingModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public setUpdateChildModalValues(): void {
    this.editChildForm.setValue({
      id: this.editChild.id,
      lastname: this.editChild.lastname,
      firstname: this.editChild.firstname,
      birthDate: this.editChild.birthDate,
      beginContract: this.editChild.beginContract,
      endContract: this.editChild.endContract,
      feesLunch: this.editChild.feesLunch,
      feesSnack: this.editChild.feesSnack,
      imageUrl: this.editChild.imageUrl,
     
    });
  }

  private editChildFormDatesIsValid(): boolean {
    var currentYear: number = new Date().getFullYear();
    var currentMonth: number = new Date().getMonth() + 1;
    
    var birthDateArrayOfString: string[] | null = this.getYearAndMonthOfDate(this.editChildForm.get('birthDate')?.value);
    var birthDateMonth = +birthDateArrayOfString!![1];
    var birthDateYear = +birthDateArrayOfString!![2];
   
    var beginContractArrayOfString: string[] | null = this.getYearAndMonthOfDate(this.editChildForm.get('beginContract')?.value);
    var beginContractMonth: number = +beginContractArrayOfString!![1];
    var beginContractYear = +beginContractArrayOfString!![2];
   
    var endContractArrayOfString: string[] | null = this.getYearAndMonthOfDate(this.editChildForm.get('endContract')?.value);
    var endContractMonth!: number;
    var endContractYear!: number;
    if (!!endContractArrayOfString) {
      endContractMonth = +endContractArrayOfString!![1];
      endContractYear = +endContractArrayOfString!![2];
    }

    if (birthDateYear > currentYear || birthDateYear < 1952
      || beginContractYear > currentYear || beginContractYear < 1952
      || endContractYear > currentYear || (endContractYear !== 0 && endContractYear < 1952)) {
      this.errorMsg = "L'année doit être comprise entre 1952 et " + currentYear;
      return false;
    }
    if (birthDateYear === currentYear && birthDateMonth > currentMonth
      || endContractYear === currentYear && endContractMonth > currentMonth) {
      this.errorMsg = "Le mois ne peut être supèrieur à: " + currentMonth + "/" + currentYear;
      return false;
    }
    if (endContractYear !== null && (endContractYear < beginContractYear || endContractYear === beginContractYear && endContractMonth < beginContractMonth)) {
      this.errorMsg = "La date de fin du contrat ne peut se situer avant le début du contrat!";
      return false;
    }
    return true;
  }

  private getYearAndMonthOfDate(date: string): string[] | null {
    if (!!date) {
      var dateSplit: string[] = date.split('/');
      console.table(dateSplit);
      return dateSplit;
    }
    return null;
  }

}




