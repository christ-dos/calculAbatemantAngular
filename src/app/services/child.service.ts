import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from "rxjs";
import { Child } from "../models/child.model";
import { environment } from "src/environments/environment";
import { catchError, tap } from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class ChildService {
    private apiCalculAbatementUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getAllChildren(): Observable<Child[]> {
        return this.http.get<Child[]>(`${this.apiCalculAbatementUrl}/child/all`)
    }

    public getChildById(id: number): Observable<Child> {
        return this.http.get<Child>(`${this.apiCalculAbatementUrl}/child/find/${id}`)
    }

    public addChild(child: Child): Observable<Child> {
        return this.http.post<Child>(`${this.apiCalculAbatementUrl}/child/add`, child);
    }

    public updateChild(child: Child): Observable<Child> {
        return this.http.put<Child>(`${this.apiCalculAbatementUrl}/child/update`, child);
    }

    public deleteChild(childId: number): Observable<String> {
        return this.http.delete<String>(`${this.apiCalculAbatementUrl}/child/delete/${childId}`);
    }

    public getTaxableSalary(childId: number, year: String): Observable<number> {
        return this.http.get<number>(`${this.apiCalculAbatementUrl}/child/taxablesalary?childId=${childId}&year=${year}`)

    }

    public getAnnualReportableAmounts(childId: number, year: String): Observable<number> {
        return this.http.get<number>(`${this.apiCalculAbatementUrl}/child/reportableamounts?childId=${childId}&year=${year}`);
    }

    public getTaxRelief(childId: number, year: String): Observable<number> {
        return this.http.get<number>(`${this.apiCalculAbatementUrl}/child/taxrelief?childId=${childId}&year=${year}`);
    }

    //todo clean code
    // private handleError(error: HttpErrorResponse) { //todo clean code

    //     if (error.status === 0) {
    //         // A client-side or network error occurred. Handle it accordingly.
    //         console.error('An error occurred:', error.error);
    //     } else {
    //         // The backend returned an unsuccessful response code.
    //         // The response body may contain clues as to what went wrong.
    //         console.error(
    //             `Backend returned code erreur: ${error.status}, body was: `, error.error);
    //     }
    //     // Return an observable with a user-facing error message.
    //     return throwError(() => new Error('Enfant non trouvé!'));
    // }

}