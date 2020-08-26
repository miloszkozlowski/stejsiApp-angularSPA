import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TipsComponent} from './tips/tips.component';
import {TipItemComponent} from './tips/tip-item/tip-item.component';
import {LoginComponent} from './login/login.component';
import {TipsStartComponent} from './tips/tips-start/tips-start.component';
import {NewTipComponent} from './tips/new-tip/new-tip.component';
import {UsersComponent} from './users/users.component';
import {NewUserComponent} from './new-user/new-user.component';
import {OfferComponent} from './offer/offer.component';
import {OfferNewComponent} from './offer/offer-new/offer-new.component';
import {SettingsComponent} from './settings/settings.component';
import {SettingsGeneralComponent} from './settings/settings-general/settings-general.component';
import {SettingsLocationsComponent} from './settings/settings-locations/settings-locations.component';
import {LocationNewComponent} from './settings/settings-locations/location-new/location-new.component';

const routes: Routes = [
    {path: '', component: LoginComponent, pathMatch: 'full'},
    {
        path: 'aktualnosci', component: TipsComponent, children: [
            {path: '', component: TipsStartComponent},
            {path: 'nowa', component: NewTipComponent},
            {path: ':id', component: TipItemComponent}
        ]
    },
    {path: 'podopieczni/nowy', component: NewUserComponent},
    {path: 'podopieczni', component: UsersComponent},
    {
        path: 'oferta', component: OfferComponent, children: [
            {path: 'nowa', component: OfferNewComponent}
        ]
    },
    {path: 'ustawienia', component: SettingsComponent, children: [
            {path: '', component: SettingsGeneralComponent},
            {path: 'lokalizacje', component: SettingsLocationsComponent, children: [
                    {path: 'nowa', component: LocationNewComponent}
                ]}
        ]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
