import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Monthly } from "../models/monthly.model";



@Injectable({
    providedIn: 'root'
})
export class MonthlyService {
    private apiCalculAbatementUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public addMonthly(monthly: Monthly): Observable<Monthly> {
        return this.http.post<Monthly>(`${this.apiCalculAbatementUrl}/monthly/add`, monthly);
    }

    public getTaxableSalarySibling(netSalary: number, netBrutCoefficient: number, maintenanceCost: number): Observable<number> {
        return this.http.get<number>(`${this.apiCalculAbatementUrl}/monthly/taxablesalarysibling?netSalary=${netSalary}&netBrutCoefficient=${netBrutCoefficient}&maintenanceCost=${maintenanceCost}`);
    }

    public getMonthliesByYearAndChildId(year: String, childId: number): Observable<Monthly[]> {
        return this.http.get<Monthly[]>(`${this.apiCalculAbatementUrl}/monthly/all/year/childid?year=${year}&childId=${childId}`);
    }
}


