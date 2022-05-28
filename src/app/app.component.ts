import { Component, Input, OnInit, Output } from '@angular/core';
import { Child } from './models/child.model';
import { ChildService } from './services/child.service';
import { NgForm } from '@angular/forms';
import { MonthlyService } from './services/monthly.service';
import { Monthly } from './models/monthly.model';
import { CalculAbatementHomeComponent } from './calcul-abatement-home/calcul-abatement-home.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private childService: ChildService) { 
  
  }
  public currentYear!: String;
  public currentMonth!: Date;

  public children!: Child[];
  
  ngOnInit(): void {
    this.currentYear = new String(new Date().getFullYear());
    this.currentMonth = new Date();
   // this.getChildren();
   
  }

  public getChildren(): void {
    this.childService.getAllChildren().subscribe(
      (response: Child[]) => {
        console.log(response);
        this.children = response;
        },
        );
      }


  

 

}
