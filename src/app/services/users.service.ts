import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {UserWriteModel} from '../models/user-write.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserModel} from '../models/user.model';
import {environment} from '../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpService} from './http.service';

@Injectable({providedIn: 'root'})
export class UsersService {
    constructor(private http: HttpClient, private httpService: HttpService) {
    }
    registerUser(user: UserWriteModel): Observable<UserModel> {
        return this.http.post<UserModel>(environment.serverPath + '/users', user)
            .pipe(catchError(err => {
                return this.httpService.handleError(err);
            }));
    }

    checkEmailAvailability(emailToCheck: string): Observable<{ emailForbidden: boolean }> {
        const queryParams = new HttpParams().set('email', emailToCheck);
        return this.http.get<{ email: string, available: boolean }>(environment.serverPath + '/users/email/available', {params: queryParams})
            .pipe(
                map(resp => {
                if(resp.email === emailToCheck && resp.available === false) {
                    return { emailForbidden: !resp.available }
                }
                return null;
            }), catchError(() => of(null)));
    }
    checkPhoneNumberAvailability(phoneNumberToCheck: string): Observable<{ phoneNumberForbidden: boolean }> {
        const queryParams = new HttpParams().set('phoneNumber', phoneNumberToCheck);
        return this.http.get<{ phoneNumber: string, available: boolean }>(environment.serverPath + '/users/phone/available', {params: queryParams})
            .pipe(
                tap(console.log),
                map(resp => {
                    if(resp.phoneNumber === phoneNumberToCheck && resp.available === false) {
                        return { phoneNumberForbidden: !resp.available }
                    }
                    return null;
                }), catchError(() => of(null)));
    }
}
