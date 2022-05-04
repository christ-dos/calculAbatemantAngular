import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { Child } from '../models/child.model';
import { ErrorMessage } from '../models/errorMessage.model';
import { ChildService } from '../services/child.service';

@Component({
  selector: 'app-calcul-abatement-child-details',
  templateUrl: './calcul-abatement-child-details.component.html',
  styleUrls: ['./calcul-abatement-child-details.component.css']
})
export class CalculAbatementChildDetailsComponent implements OnInit {
  

  constructor(
    private route: ActivatedRoute,
    private childService: ChildService
  ) { }

  public childDetails!: Child;
  public errorMsg!: ErrorMessage;
 

  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('childId')!;
    this.getChildDetails(id);
    console.log('id: ' + id);
  }

  public getChildDetails(id: number): void{
    this.childService.getChildById(id).subscribe({
      next: child =>{
        this.childDetails = child;
        console.log("childDetails: " + child);
      },
      error: err => {
        this.errorMsg = err.message;
        console.log("mon erreur: " + this.errorMsg);
        
      }
      
    }
    );



   // this.childService.getChildById(id).subscribe(
     // (response: Child) => {
      //  console.log(response);
      //  this.childDetails = response;
     // }
    //)
    

  }

  

}
