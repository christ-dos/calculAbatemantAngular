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
                        if (error == null) {
                            console.log("aucune erreur!")
                        }
                        errorMessage = `Error Status: ${error.status},
                        Error Url: ${error.message},
                        Error Message: ${error.error.message}`;
                        console.log(errorMessage);
                    }
                    return throwError(() => new Error(error?.error?.message));
                })
            );
    }
}