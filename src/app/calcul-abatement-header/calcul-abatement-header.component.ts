import { Component, OnInit } from '@angular/core';
import { Child } from '../models/child.model';

@Component({
  selector: 'app-calcul-abatement-header',
  templateUrl: './calcul-abatement-header.component.html',
  styleUrls: ['./calcul-abatement-header.component.css']
})
export class CalculAbatementHeaderComponent implements OnInit {

  constructor() { }

  public addMonthlyChild!: Child;
  ngOnInit(): void {
  }

  public onOpenModel(child: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addChildModal');
    }
    if (mode === "addMonthly") {
      this.addMonthlyChild = child;
      button.setAttribute('data-target', '#addMonthlyModal');
    }
    if (mode === "taxableSalarySibling") {
      button.setAttribute('data-target', '#taxableSalarySiblingModal');
    }
    container?.appendChild(button);
    button.click();
  }

}
