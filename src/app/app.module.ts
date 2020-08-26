import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HeaderComponent} from './header/header.component';
import {HomeScreenComponent} from './home-screen/home-screen.component';
import {TipsComponent} from './tips/tips.component';
import {TipItemComponent} from './tips/tip-item/tip-item.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import '@angular/common/locales/global/pl';
import {DropdownDirective} from './directives/dropdown.directive';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TipsStartComponent} from './tips/tips-start/tips-start.component';
import {TipsListComponent} from './tips/tips-list/tips-list.component';
import {TipsListItemComponent} from './tips/tips-list-item/tips-list-item.component';
import {NewTipComponent} from './tips/new-tip/new-tip.component';
import {AlertComponent} from './shared/alert/alert.component';
import {UsersComponent} from './users/users.component';
import {NewUserComponent} from './new-user/new-user.component';
import {UserEmailValidator} from './models/validators/user-email.validator';
import {LoadingSpinnerComponent} from './shared/loading-spinner/loading-spinner.component';
import {UserPhoneNumberValidator} from './models/validators/user-phone-number.validator';
import {OfferComponent} from './offer/offer.component';
import {OfferNewComponent} from './offer/offer-new/offer-new.component';
import {OfferListComponent} from './offer/offer-list/offer-list.component';
import {MinimumNumberValidator} from './models/validators/minimum-number.validator';
import {OfferListItemComponent} from './offer/offer-list-item/offer-list-item.component';
import {NgxPopper} from 'angular-popper';
import {LoadingSpinnerLgComponent} from './shared/loading-spinner-lg/loading-spinner-lg.component';
import {FooterComponent} from './footer/footer.component';
import {SettingsComponent} from './settings/settings.component';
import {SettingsGeneralComponent} from './settings/settings-general/settings-general.component';
import {SettingsLocationsComponent} from './settings/settings-locations/settings-locations.component';
import {LocationListItem} from './settings/settings-locations/location-list-item/location-list-item';
import {LocationNewComponent} from './settings/settings-locations/location-new/location-new.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LocationRemoveDialog} from './settings/settings-locations/location-remove-dialog/location-remove-dialog';


@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        DropdownDirective,
        LoginComponent,
        HeaderComponent,
        HomeScreenComponent,
        TipsComponent,
        TipItemComponent,
        TipsStartComponent,
        TipsListComponent,
        TipsListItemComponent,
        NewTipComponent,
        AlertComponent,
        UsersComponent,
        NewUserComponent,
        UserEmailValidator,
        UserPhoneNumberValidator,
        MinimumNumberValidator,
        LoadingSpinnerComponent,
        LoadingSpinnerLgComponent,
        OfferComponent,
        OfferNewComponent,
        OfferListComponent,
        OfferListItemComponent,
        SettingsComponent,
        SettingsGeneralComponent,
        SettingsLocationsComponent,
        LocationListItem,
        LocationNewComponent,
        LocationRemoveDialog
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        FontAwesomeModule,
        NgxPopper,
        BrowserAnimationsModule
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'pl-PL'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
