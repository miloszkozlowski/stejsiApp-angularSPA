import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// let keycloak = Keycloak(environment.keycloak);
//
// keycloak.init({onLoad: 'login-required'}).then((auth) => {
//   if(!auth) {
//     console.log("inicjacja: nie jest autentykowany - niech ssie");
//   }
//   else {
//     console.log("inicjacja: jest autentykowany! Huuujjaaa!")
//   }
//
//   platformBrowserDynamic().bootstrapModule(AppModule)
//       .catch(err => console.log(err));
//
//   localStorage.setItem('ang-token', keycloak.token);
//   localStorage.setItem('ang-refresh-token', keycloak.refreshToken);
//
//   setTimeout(() => {
//     keycloak.updateToken(70).then((refreshed) => {
//       if(refreshed) {
//         console.debug('Token się odświeżył i nie śmierdzi' + refreshed);
//       }
//       else {
//         console.warn('Token się nie odświeżył i śmierdzi ważny ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' sekund');
//       }
//     }).catch(err => {
//       console.error('Nie dało rady odświeżyć tokena... :( Smuteczek!: ' + err);
//     });
//   }, 60000)
// }).catch(() => {
//   console.error('Autentykacja się w ogóle nie udała i to jest największy smuteczek!')
// });
