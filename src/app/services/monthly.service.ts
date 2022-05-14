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

    public updateMonthly(monthly: Monthly): Observable<Monthly> {
        return this.http.put<Monthly>(`${this.apiCalculAbatementUrl}/monthly/update`, monthly);
    }

    public deleteMonthly(monthlyId: number): Observable<void>{
        return this.http.delete<void>(`${this.apiCalculAbatementUrl}/monthly/delete/${monthlyId}`);
    }

    public getTaxableSalarySibling(netSalary: number, netBrutCoefficient: number, maintenanceCost: number): Observable<number> {
        return this.http.get<number>(`${this.apiCalculAbatementUrl}/monthly/taxablesalarysibling?netSalary=${netSalary}&netBrutCoefficient=${netBrutCoefficient}&maintenanceCost=${maintenanceCost}`);
    }

    public getMonthliesByYearAndChildId(year: String, childId: number): Observable<Monthly[]> {
        return this.http.get<Monthly[]>(`${this.apiCalculAbatementUrl}/monthly/all/year/childid?year=${year}&childId=${childId}`);
    }

    public getMonthliesByChildIdOrderByYearDescAndMonthDesc(childId: number): Observable<Monthly[]> {
        return this.http.get<Monthly[]>(`${this.apiCalculAbatementUrl}/monthly/all/childid?childId=${childId}`);
    }

    public getMonths(): Observable<String[]> {
        return this.http.get<String[]>(`${this.apiCalculAbatementUrl}/monthly/months`);
    }
}


