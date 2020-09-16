import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import {LoginComponent} from './login/login.component';
import {KeycloakCustomAuthGuard} from './auth/keycloak-custom-auth.guard';
import {IndexComponent} from './index/index.component';
import {NotFoundComponent} from './not-found-error/not-found.component';

const routes: Routes = [
    {path: '', component: IndexComponent},
    {path: 'login', component: LoginComponent},
    {path: 'podopieczni', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), canActivate: [KeycloakCustomAuthGuard]},
    {path: 'oferta', loadChildren: () => import('./offer/offer.module').then(m => m.OfferModule), canActivate: [KeycloakCustomAuthGuard]},
    {path: 'ustawienia', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule), canActivate: [KeycloakCustomAuthGuard]},
    {path: 'aktualnosci', loadChildren: () => import('./tips/tips.module').then(m => m.TipsModule), canActivate: [KeycloakCustomAuthGuard]},
    {path: 'home', loadChildren: () => import('./home-screen/home-screen.module').then(m => m.HomeScreenModule), canActivate: [KeycloakCustomAuthGuard]},
    {path: 'kalendarz', component: CalendarComponent, canActivate: [KeycloakCustomAuthGuard]},
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
