import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {KeycloakCustomService} from '../services/keycloak-custom.service';
import {exhaustMap, take} from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private keycloakService: KeycloakCustomService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.keycloakService.loggedUser.pipe(take(1), exhaustMap(user => {
            if (!user) {
                return next.handle(req);
            }
            const modifiedReq = req.clone({headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.accessToken)});
            return next.handle(modifiedReq);
        }));
    }
}
