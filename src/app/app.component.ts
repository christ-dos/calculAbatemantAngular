import { Component, Input, OnInit } from '@angular/core';
import { Child } from './models/child.model';
import { ChildService } from './services/child.service';
import { Observable } from "rxjs";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 
  
  public children!: Child[];

  constructor(private childService: ChildService){}

  ngOnInit(): void {
       this.getChildren();
  }

  public getChildren(): void{
    this.childService.getAllChildren().subscribe(
      (response: Child[]) =>{
        this.children = response;
      }
      // (error: HttpErrorResponse) =>{
      //   alert(error.message);
      // }
    )
  }
}
