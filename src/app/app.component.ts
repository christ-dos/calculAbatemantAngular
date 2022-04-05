import { Component, Input, OnInit } from '@angular/core';
import { Child } from './models/child.model';
import { ChildService } from './services/child.service';
import { Observable } from "rxjs";
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { waitForAsync } from '@angular/core/testing';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 
  public children: Child[] = [];
  public editChild!: Child ;
  public deleteChild!: Child;
  public currentyear!: String;
  public taxableSalary!: number;
  public reportableAmounts!: number;
  
  
 constructor(private childService: ChildService){}

  ngOnInit(): void {
    this.getChildren();
    this.currentyear = new String(new Date().getFullYear());
  }

  public getChildren(): void{
    this.childService.getAllChildren().subscribe(
      (response: Child[]) =>{
        console.log("responsegetChild: " + response);
        this.children = response;
        this.children.forEach((child) =>{
          this.getTaxableSalary(child);
          this.getAnnualReportableAmounts(child, 1, 0.5);
        });
      }
    )
  }

  public getTaxableSalary(child: Child): void{
    this.childService.getTaxableSalary(child.id, this.currentyear).subscribe(
      (response: number) =>{
        this.taxableSalary = Math.round(response * 100)/100;
        child.taxableSalary = this.taxableSalary;
      }
    )
  }

  public getAnnualReportableAmounts(child: Child, feeLunch: number, feeTaste: number): void{
    this.childService.getAnnualReportableAmounts(child.id, this.currentyear,feeLunch,feeTaste ).subscribe(
      (response: number) =>{
        this.reportableAmounts = Math.round(response * 100)/100;
        child.ReportableAmounts = this.reportableAmounts;
      }
    )
  }

  public onAddChild(addForm: NgForm): void{
    document.getElementById('add-employee-form')?.click();
     this.childService.addChild(addForm.value).subscribe(
       (response: Child) => {
         console.log(response);
          this.getChildren();
          addForm.reset();
       }
     );
    }

    public onUpdateChild(child: Child): void{
      this.childService.updateChild(child).subscribe(
         (response: Child) => {
           console.log(response);
            this.getChildren();
         }
       );
      }

      public onDeleteChild(childId: number): void{
        this.childService.deleteChild(childId).subscribe(
           (response: void) => {
             console.log(response);
              this.getChildren();
           }
         );
        }

  public onOpenModel(child: any , mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target','#addChildModal')
    }
    if(mode === 'edit'){
      this.editChild = child;
      button.setAttribute('data-target','#updateChildModal')
    }
    if(mode === 'delete'){
      this.deleteChild = child
      button.setAttribute('data-target','#deleteChildModal')
    }
    container?.appendChild(button);
    button.click();
  }
}
