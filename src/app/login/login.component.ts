import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  infoMessage: string;
  errorMessage: string;
  isLoginIn = false;

  constructor() { }

  ngOnInit(): void {
  }

  onLoginSubmit(loginForm: NgForm) {
    this.isLoginIn = true;
  }

}
