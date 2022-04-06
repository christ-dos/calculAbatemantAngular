import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Monthly } from "../models/Monthly.model";


@Injectable({
    providedIn: 'root'
})
export class MonthlyService {
    private apiCalculAbatementUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public addMonthly(monthly: Monthly): Observable<Monthly> {
        return this.http.post<Monthly>(`${this.apiCalculAbatementUrl}/monthly/add`, monthly);
    }
}


