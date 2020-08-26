import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  errMsg: String = null;

  constructor() { }

  ngOnInit(): void {
  }

  onLogin(username: HTMLInputElement, password: HTMLInputElement) {
    if(username.value === '' || password.value === '') {
      this.errMsg = 'Aby zalogować się, należy podać nazwę użytkowika i hasło';
    }
    else {
      this.errMsg = null;
    }
  }

}
