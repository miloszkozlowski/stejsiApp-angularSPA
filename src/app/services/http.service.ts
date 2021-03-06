import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    topErrorBoxString = new Subject<string>();
    handleError(errorResp: HttpErrorResponse): Observable<any> {
        let errorMsg = 'Nieznany błąd. Po prostu spróbuj jeszcze raz.'
        if (errorResp.message) {
            errorMsg = '<strong>Nieoczekiwany błąd: </strong>' + errorResp.message;
        }
        if (errorResp.error) {
            // Keycloak responses
            if(errorResp.error.error) {
                switch (errorResp.error.error) {
                    case 'invalid_grant':
                        errorMsg = '<strong>Błąd logowania:</strong> próba logowania nie powiodła się - spróbuj jeszcze raz';
                        break;
                    default:
                        errorMsg = 'Wystapił nieoczekiwany problem z zabezpieczeniami';
                }
            }
            // all others
            else if(errorResp.error.errorMsg) {
                switch (errorResp.error.errorMsg) {
                    case 'CALENDAR_CONFLICT':
                        errorMsg = 'Wybrany termin koliduje z innym w kalendarzu';
                        break;
                    case 'VALID_ERROR':
                        errorMsg = 'Formularz zawiera niepoprawne dane';
                        break;
                    case 'PACKAGE_TYPE_NOT_FOUND':
                        errorMsg = 'Nie można było odnaleźć takiej oferty (' + errorResp.error.errorDesc + ')';
                        break;
                    case 'LOCATION_NOT_FOUND':
                        errorMsg = 'Nie można było odnaleźć takiej lokalizacji (' + errorResp.error.errorDesc + ')';
                        break;
                    default:
                        errorMsg = errorResp.error.errorCode;
                }
            }
        }
        this.topErrorBoxString.next(errorMsg);
        return throwError(errorMsg);
    }
}
