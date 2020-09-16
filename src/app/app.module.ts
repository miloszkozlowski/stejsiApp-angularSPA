import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HeaderComponent} from './header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import '@angular/common/locales/global/pl';
import {FooterComponent} from './footer/footer.component';
import {DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from './shared/shared.module';
import {FormsModule} from '@angular/forms';
import {IndexComponent} from './index/index.component';
import {TokenInterceptor} from './auth/token.interceptor';
import {NotFoundComponent} from './not-found-error/not-found.component';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        LoginComponent,
        HeaderComponent,
        IndexComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        HttpClientModule,
        SharedModule,
        FormsModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        DatePipe,
        {provide: LOCALE_ID, useValue: 'pl-PL'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
