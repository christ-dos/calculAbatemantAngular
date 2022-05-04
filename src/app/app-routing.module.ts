import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalculAbatementChildDetailsComponent } from "./calcul-abatement-child-details/calcul-abatement-child-details.component";
import { CalculAbatementHomeComponent } from "./calcul-abatement-home/calcul-abatement-home.component";
import { CalculAbatementMonthlyComponent } from "./calcul-abatement-monthly/calcul-abatement-monthly.component";

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: CalculAbatementHomeComponent},
    {path: 'monthlies',component: CalculAbatementMonthlyComponent},
    {path: 'child/details/:childId',component: CalculAbatementChildDetailsComponent},
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
    
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