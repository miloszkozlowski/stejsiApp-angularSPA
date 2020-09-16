import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {KeycloakCustomService} from '../services/keycloak-custom.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  infoMessage: string;
  errorMessage: string;
  isLoginIn = false;

  constructor(
      private keycloakService: KeycloakCustomService,
      private router: Router
  ) { }

  onLoginSubmit(loginForm: NgForm) {
    this.isLoginIn = true;
    this.keycloakService.login(loginForm.value.login, loginForm.value.password)
        .subscribe(() => {
          this.isLoginIn = false;
          this.router.navigate(['/home']).then();

        }, err => {
          this.isLoginIn = false;
          loginForm.controls['password'].reset();
          this.errorMessage = err;
        });

  }
}
