import { ParseTreeResult } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AppComponent } from '../app.component';
import { CalculAbatementHomeComponent } from '../calcul-abatement-home/calcul-abatement-home.component';
import { ErrorIntercept } from '../error.interceptor';
import { Child } from '../models/child.model';
import { Monthly } from '../models/monthly.model';
import { ChildService } from '../services/child.service';
import { MonthlyService } from '../services/monthly.service';

@Component({
  selector: 'app-calcul-abatement-header',
  templateUrl: './calcul-abatement-header.component.html',
  styleUrls: ['./calcul-abatement-header.component.css']
})
export class CalculAbatementHeaderComponent implements OnInit {
  public calculAbatementHomeComponent!: CalculAbatementHomeComponent;

  public addChildForm!: FormGroup;

  constructor
    (private monthlyService: MonthlyService,
      public appComponent: AppComponent,
      private childService: ChildService,
      private fb: FormBuilder,) {

    this.calculAbatementHomeComponent = new CalculAbatementHomeComponent(childService, monthlyService, appComponent, fb);

  }


  public errorMsg!: String;
  public successMsg!: String;
  public errorsValidation!: String;

  public validationErrorsMessages: any = {
    required: "Ce champ est requis",
  };

  public ChildrenHeader!: Child[];
  ngOnInit(): void {
    this.getAddChildForm();
  }

  public getAddChildForm(): void {
    this.addChildForm = this.fb.group({
      lastname: ["", [Validators.required,
         Validators.minLength(2),
         Validators.maxLength(30), 
         Validators.pattern(/^[a-zA-Z ]+$/)]],
      firstname: ["", [Validators.required,
         Validators.minLength(2),
         Validators.maxLength(30),
         Validators.pattern(/^[a-zA-Z ]+$/)]],
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

    const lastnameControl = this.addChildForm.get('lastname');
    const firstnameControl = this.addChildForm.get('firstname');
    const birthDateControl = this.addChildForm.get('birthDate');
    const beginContractControl = this.addChildForm.get('beginContract');
    const endContractControl = this.addChildForm.get('endContract');
    const feesLunchControl = this.addChildForm.get('feesLunch');
    const feesSnackControl = this.addChildForm.get('feesSnack');
    const imageUrlControl = this.addChildForm.get('imageUrl');

    this.formControlsValueChange(lastnameControl);
    this.formControlsValueChange(firstnameControl);
    this.formControlsValueChange(birthDateControl);
    this.formControlsValueChange(beginContractControl);
    this.formControlsValueChange(endContractControl);
    this.formControlsValueChange(feesLunchControl);
    this.formControlsValueChange(feesSnackControl);
    this.formControlsValueChange(imageUrlControl);
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

  public onAddChild(): void {
    document.getElementById('cancel-add-child-form')?.click();
    if (this.addChildFormDatesIsValid()) {
      this.addChildForm.patchValue({
        firstname: this.addChildForm.value.firstname.toLocaleLowerCase(),
        lastname: this.addChildForm.value.lastname.toLocaleLowerCase(),
      });
      this.childService.addChild(this.addChildForm.value).subscribe({
        next: child => {
          console.log(child);
          this.successMsg = "Enfant: " + this.addChildForm.get('firstname')?.value + " " + this.addChildForm.get('lastname')?.value + " ajouté avec succés!"
          this.addChildForm.reset();
        },
        error: err => {
          this.errorMsg = err.message;
        }
      });
    } 
  }

  public hideError(errorToHide: String): void {
    if (errorToHide === "errorMsg") {
      this.errorMsg = '';
    }
    this.successMsg = '';
  }

  private getYearAndMonthOfDate(date: string): string[] | null {
    if (!!date) {
      var dateSplit: string[] = date.split('/');
      console.table(dateSplit);
      return dateSplit;
    }
    return null;
  }

  private addChildFormDatesIsValid(): boolean {
    var currentYear: number = new Date().getFullYear();
    var currentMonth: number = new Date().getMonth() + 1;
    
    var birthDateArrayOfString: string[] | null = this.getYearAndMonthOfDate(this.addChildForm.get('birthDate')?.value);
    var birthDateMonth = +birthDateArrayOfString!![1];
    var birthDateYear = +birthDateArrayOfString!![2];
   
    var beginContractArrayOfString: string[] | null = this.getYearAndMonthOfDate(this.addChildForm.get('beginContract')?.value);
    var beginContractMonth: number = +beginContractArrayOfString!![1];
    var beginContractYear = +beginContractArrayOfString!![2];
   
    var endContractArrayOfString: string[] | null = this.getYearAndMonthOfDate(this.addChildForm.get('endContract')?.value);
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

  // public getChildren() : void {;
  //   this.childService.getAllChildren().subscribe(
  //     (response: Child[]) => {
  //       console.log(response);
  //       this.ChildrenHeader = response;
  //     },
  //   );
  // }

}
