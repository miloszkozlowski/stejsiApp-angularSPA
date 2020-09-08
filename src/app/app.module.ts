import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HeaderComponent} from './header/header.component';
import {HomeScreenComponent} from './home-screen/home-screen.component';
import {TipsComponent} from './tips/tips.component';
import {TipItemComponent} from './tips/tip-item/tip-item.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {NewUserComponent} from './users/new-user/new-user.component';
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
import {UserSearchItemComponent} from './users/users-search-item/user-search-item.component';
import {UserSelectedComponent} from './users/user-selected/user-selected.component';
import {UserSearchFormComponent} from './user-search-form/user-search-form.component';
import {UserPlannerComponent} from './users/user-planner/user-planner.component';
import {UserCalendarComponent} from './users/user-calendar/user-calendar.component';
import {UserTrainingListComponent} from './users/user-trainings-list/user-training-list.component';
import {DatePipe} from '@angular/common';
import {UserAllPackagesComponent} from './users/user-all-packages/user-all-packages.component';
import {UserPackageModalComponent} from './users/user-all-packages/user-package-modal/user-package-modal.component';
import {ClickOutsideModule} from 'ng-click-outside';
import {CalendarComponent} from './calendar/calendar.component';
import {CalendarItemComponent} from './calendar/calendar-item/calendar-item.component';


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
        LocationRemoveDialog,
        UserSearchItemComponent,
        UserSelectedComponent,
        UserSearchFormComponent,
        UserPlannerComponent,
        UserCalendarComponent,
        UserTrainingListComponent,
        UserAllPackagesComponent,
        UserPackageModalComponent,
        CalendarComponent,
        CalendarItemComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        FontAwesomeModule,
        NgxPopper,
        BrowserAnimationsModule,
        ClickOutsideModule
    ],
    providers: [
        DatePipe,
        {provide: LOCALE_ID, useValue: 'pl-PL'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
