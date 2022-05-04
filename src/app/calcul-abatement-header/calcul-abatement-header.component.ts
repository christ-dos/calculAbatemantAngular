import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CalculAbatementHomeComponent } from '../calcul-abatement-home/calcul-abatement-home.component';
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
  
  constructor
  (private monthlyService: MonthlyService, 
    public appComponent: AppComponent,
    private childService: ChildService) {
      this.calculAbatementHomeComponent = new CalculAbatementHomeComponent(childService, monthlyService, appComponent);
   
     }

  public addMonthlyChild!: Child;
  public children!: Child[];
  ngOnInit(): void {
  }

  public getChildren(): Child[] {
    this.childService.getAllChildren().subscribe(
      (response: Child[]) => {
        console.log(response);
        this.children = response;
        },
        );
        return this.children;
      }

  public onOpenModel(mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addChildModal');
    }
    container?.appendChild(button);
    button.click();
  }

}
