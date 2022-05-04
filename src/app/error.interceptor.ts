import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export class ErrorIntercept implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                   
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        console.log('This is client side error');
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        // server-side error
                        console.log('This is server side error');
                        errorMessage = `Error Status: ${error.status}\n,
                                        Message: ${error.message}`;              
                    }
                    console.log("errorMessage: " + error.message);
                   
                   return throwError(() => new Error(error.message));
                })
            )
    }
}