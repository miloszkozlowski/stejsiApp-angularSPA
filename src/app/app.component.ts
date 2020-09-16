import {Component, OnInit} from '@angular/core';
import {KeycloakCustomService} from './services/keycloak-custom.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loggedIn = false;
  title = 'stejsi'

  constructor(private keycloakService: KeycloakCustomService) {
  }

  ngOnInit() {
    this.keycloakService.autoLogin();
  }
}
