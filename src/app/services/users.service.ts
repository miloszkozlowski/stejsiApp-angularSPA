import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {UserWriteModel} from '../models/user-write.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserModel} from '../models/user.model';
import {environment} from '../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpService} from './http.service';
import {PageModel} from '../models/pagination/page.model';
import {normalizeSync} from 'normalize-diacritics';

export const ENDPOINT = environment.serverPath + '/users';

@Injectable({providedIn: 'root'})
export class UsersService {
    userSearchPhrase = new Subject<string>();
    userSearchClearField = new Subject();
    userSelectedSbj = new Subject<UserModel>();
    userLoadedSbj = new BehaviorSubject<UserModel[]>([]);
    userSelected: UserModel = null;
    usersLoaded: UserModel[] = [];
    isLastPage = false;
    isPerformingSearch = new BehaviorSubject<boolean>(false);
    isShowingSearchResults = new BehaviorSubject<boolean>(false);
    pageToLoad = 0;
    errorMessageSbj = new Subject<string>();
    infoMessageSbj = new Subject<string>();
    isLoading = new Subject<boolean>();

    constructor(private http: HttpClient, private httpService: HttpService) {
    }

    registerUser(user: UserWriteModel): Observable<UserModel> {
        return this.http.post<UserModel>(ENDPOINT, user)
            .pipe(catchError(err => {
                return this.httpService.handleError(err);
            }));
    }

    checkEmailAvailability(emailToCheck: string): Observable<{ emailForbidden: boolean }> {
        const queryParams = new HttpParams().set('email', emailToCheck);
        return this.http.get<{ email: string, available: boolean }>(ENDPOINT + '/email/available', {params: queryParams})
            .pipe(
                map(resp => {
                    if (resp.email === emailToCheck && resp.available === false) {
                        return {emailForbidden: !resp.available};
                    }
                    return null;
                }), catchError(() => of(null)));
    }

    checkPhoneNumberAvailability(phoneNumberToCheck: string): Observable<{ phoneNumberForbidden: boolean }> {
        const queryParams = new HttpParams().set('phoneNumber', phoneNumberToCheck);
        return this.http.get<{ phoneNumber: string, available: boolean }>(ENDPOINT + '/phone/available', {params: queryParams})
            .pipe(
                tap(console.log),
                map(resp => {
                    if (resp.phoneNumber === phoneNumberToCheck && resp.available === false) {
                        return {phoneNumberForbidden: !resp.available};
                    }
                    return null;
                }), catchError(() => of(null)));
    }

    performSearchQuery(keyWord: string): Observable<UserModel[]> {
        this.isLoading.next(true);
        const convertedSearchKey = normalizeSync(keyWord);
        const params = new HttpParams()
            .set('keyword', convertedSearchKey);
        return this.http.get<UserModel[]>(ENDPOINT + '/search', {params: params})
            .pipe(
                tap(usersFound => {
                    this.isLoading.next(false);
                    this.userLoadedSbj.next(usersFound);
                    this.isPerformingSearch.next(false);
                    this.isShowingSearchResults.next(true);
                    this.userSearchPhrase.next(keyWord);
                }),
                catchError(error => {
                    this.isLoading.next(false);
                    this.isPerformingSearch.next(false);
                    return this.httpService.handleError(error);

                })
            );
    }

    getNextUsersSlice(): Observable<any> {
        this.isLoading.next(true);
        this.isShowingSearchResults.next(false);
        const params = new HttpParams().set(
            'page', String(this.pageToLoad)
        );
        return this.http.get<PageModel<UserModel>>(ENDPOINT, {params: params})
            .pipe(
                tap(slice => {
                    this.pageToLoad = slice.number + 1;
                    this.isLastPage = slice.last;
                    if (slice.first) {
                        this.usersLoaded = [];
                    }
                    this.usersLoaded.push(...slice.content);
                    this.userLoadedSbj.next(this.usersLoaded);
                    this.isLoading.next(false);
                }),
                catchError(err => {
                    this.isLoading.next(false);
                    return this.httpService.handleError(err);
                }),
            );
    }

    getUserById(id: number): Observable<UserModel> {
        this.userSelected = null;
        if (this.usersLoaded.length > 0) {
            for (let u of this.usersLoaded) {
                if (u.id == id) {
                    return of(u);
                }
            }
        }
        return this.http.get<UserModel>(ENDPOINT + '/' + id)
            .pipe(catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

    onResetSearchResults() {
        this.isShowingSearchResults.next(false);
        if (this.usersLoaded.length > 0) {
            this.userLoadedSbj.next(this.usersLoaded);
        } else {
            this.getNextUsersSlice();
        }
    }


}
