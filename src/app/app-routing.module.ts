import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import {HomeScreenComponent} from './home-screen/home-screen.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'podopieczni', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
    {path: 'oferta', loadChildren: () => import('./offer/offer.module').then(m => m.OfferModule)},
    {path: 'ustawienia', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
    {path: 'aktualnosci', loadChildren: () => import('./tips/tips.module').then(m => m.TipsModule)},
    {path: 'home', component: HomeScreenComponent},
    {path: 'kalendarz', component: CalendarComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
