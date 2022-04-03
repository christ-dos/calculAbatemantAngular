import { Component, Input, OnInit } from '@angular/core';
import { Child } from './models/child.model';
import { ChildService } from './services/child.service';
import { Observable } from "rxjs";
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 
  public children: Child[] = [];
  public editChild!: Child ;
  public deleteChild!: Child;
  
 constructor(private childService: ChildService){}

  ngOnInit(): void {
    this.getChildren();
  }

  public getChildren(): void{
    this.childService.getAllChildren().subscribe(
      (response: Child[]) =>{
        this.children = response;
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
