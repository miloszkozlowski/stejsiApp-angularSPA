import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HeaderComponent} from './header/header.component';
import {HomeScreenComponent} from './home-screen/home-screen.component';
import {HttpClientModule} from '@angular/common/http';

import '@angular/common/locales/global/pl';
import {FooterComponent} from './footer/footer.component';
import {DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CalendarModule} from './calendar/calendar.module';
import {OfferModule} from './offer/offer.module';
import {SettingsModule} from './settings/settings.module';
import {TipsModule} from './tips/tips.module';
import {UsersModule} from './users/users.module';
import {SharedModule} from './shared/shared.module';
import {NgxPopper} from 'angular-popper';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        LoginComponent, //???
        HeaderComponent,
        HomeScreenComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        HttpClientModule,
        CalendarModule,
        SharedModule,
        FormsModule
    ],
    providers: [
        DatePipe,
        {provide: LOCALE_ID, useValue: 'pl-PL'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
