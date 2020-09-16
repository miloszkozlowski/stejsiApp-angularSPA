import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {HttpService} from './http.service';
import {catchError, tap} from 'rxjs/operators';
import {LoggedUserModel} from '../auth/logged-user.model';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import {environment} from '../../environments/environment';

export interface AuthData {
    access_token: string,
    expires_in: number,
    id_token: string,
    // not-before-policy: boolean,
    refresh_expires_in: number,
    refresh_token: string,
    scope: string,
    session_state: string,
    token_type: string
}

const ENDPOINT = environment.keycloak.url;

@Injectable({
    providedIn: 'root'
})
export class KeycloakCustomService {

    loggedUser = new BehaviorSubject<LoggedUserModel>(null);
    tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private httpService: HttpService,
        private router: Router
    ) {
    }

    login(username: string, password: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };

        const params = new HttpParams({
            fromObject: {
                grant_type: 'password',
                client_id: environment.keycloak.clientId,
                username: username,
                password: password,
                scope: 'openid'
            }
        });


        return this.http.post<AuthData>(ENDPOINT + '/realms/' + environment.keycloak.realm + '/protocol/openid-connect/token', params, httpOptions)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                }),
                tap(response => {
                    this.handleAuthentication(response);
                }));
    }

    handleAuthentication(authData: AuthData) {
        let tokenInfo = jwt_decode(authData.access_token);
        const tokenExpiresAt = new Date(new Date().getTime() + authData.expires_in * 1000);
        const loggedUser = new LoggedUserModel(
            authData.id_token,
            authData.access_token,
            tokenExpiresAt,
            tokenInfo['name'],
            tokenInfo['email'],
            // @ts-ignore
            tokenInfo.realm_access.roles
        );
        this.loggedUser.next(loggedUser);
        this.autoLogout(authData.expires_in * 1000);
        localStorage.setItem('userData', JSON.stringify(loggedUser));
    }

    autoLogout(expDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expDuration);
    }

    logout() {
        this.loggedUser.next(null);
        localStorage.removeItem('userData');
        this.router.navigate(['/']).then();
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
        const loadedUserData: {
            userId: string;
            _accessToken: string;
            _accessTokenValidity: Date;
            name: string,
            email: string,
            roles: string[]
        } = JSON.parse(localStorage.getItem('userData'));
        if (!loadedUserData) {
            return;
        }
        const loadedUser = new LoggedUserModel(
            loadedUserData.userId,
            loadedUserData._accessToken,
            new Date(loadedUserData._accessTokenValidity),
            loadedUserData.name,
            loadedUserData.email,
            loadedUserData.roles
        );
        if (!loadedUser.accessToken) {
            return;
        }
        this.loggedUser.next(loadedUser);
        const expireDuration = new Date(loadedUserData._accessTokenValidity).getTime() - new Date().getTime();
        this.autoLogout(expireDuration);
    }
}
