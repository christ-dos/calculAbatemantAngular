import { Monthly } from "./monthly.model";

export class Child{
   
  constructor( public id: number,
       public lastname: string,
       public firstname: string,
       public birthDate: string,
       public beginContract: string,
       public endContract: string,
       public imageUrl: string,
       public userEmail: string,
       public taxableSalary: number,
       public reportableAmounts: number,
       public taxRelief: number,
       public feesLunch: number,
       public feesSnack: number,
       public monthlies: Monthly[]
  ){} 

}

