import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {KeycloakCustomService} from '../services/keycloak-custom.service';
import {map, take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class KeycloakCustomAuthGuard implements CanActivate {

    constructor(
        private keycloakService: KeycloakCustomService,
        private router: Router
    ) {
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.keycloakService.loggedUser
            .pipe(
                take(1),
                map(user => {
                    const isAuth = !!user;
                    if(isAuth) {
                        return true;
                    }
                    else {
                        return this.router.createUrlTree(['/login']);
                    }
                })
            )

    }

}
