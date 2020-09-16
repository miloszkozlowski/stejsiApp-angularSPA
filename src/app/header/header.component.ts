import {Component, OnDestroy, OnInit} from '@angular/core';
import {KeycloakCustomService} from '../services/keycloak-custom.service';
import {Subscription} from 'rxjs';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons/faSignOutAlt';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    isAuthenticated: boolean = false;
    private authSub: Subscription;

    faSignOutAlt = faSignOutAlt;

    constructor(private keycloakService: KeycloakCustomService) {
    }

    ngOnInit() {
        this.authSub = this.keycloakService.loggedUser.subscribe(user => {
            if(user) {
                this.isAuthenticated = user.accessToken != null;
            }
            else {
                this.isAuthenticated = false;
            }
        })
    }

    ngOnDestroy() {
        this.authSub.unsubscribe();
    }

    onLogout() {
        this.keycloakService.logout();
    }

}
