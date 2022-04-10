import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalculAbatementHomeComponent } from "./calcul-abatement-home/calcul-abatement-home.component";
import { CalculAbatementMonthlyComponent } from "./calcul-abatement-monthly/calcul-abatement-monthly.component";

const routes: Routes = [
    {path: 'home', component: CalculAbatementHomeComponent},
    {path: 'monthly',component: CalculAbatementMonthlyComponent}
    
];

@NgModule(
    {
        imports: [
            RouterModule.forRoot(routes)
        ],
        exports: [
            RouterModule
        ]
    }
)
export class AppRoutingModule{

}