import {NgModule} from '@angular/core';
import {UsersComponent} from './users.component';
import {NewUserComponent} from './new-user/new-user.component';
import {UserEmailValidator} from '../models/validators/user-email.validator';
import {UserPhoneNumberValidator} from '../models/validators/user-phone-number.validator';
import {UserSearchItemComponent} from './users-search-item/user-search-item.component';
import {UserSelectedComponent} from './user-selected/user-selected.component';
import {UserPlannerComponent} from './user-planner/user-planner.component';
import {UserCalendarComponent} from './user-calendar/user-calendar.component';
import {UserTrainingListComponent} from './user-trainings-list/user-training-list.component';
import {UserAllPackagesComponent} from './user-all-packages/user-all-packages.component';
import {UserPackageModalComponent} from './user-all-packages/user-package-modal/user-package-modal.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        UsersComponent,
        NewUserComponent,
        UserEmailValidator,
        UserPhoneNumberValidator,
        UserSearchItemComponent,
        UserSelectedComponent,
        UserPlannerComponent,
        UserCalendarComponent,
        UserTrainingListComponent,
        UserAllPackagesComponent,
        UserPackageModalComponent,
    ],
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild([
            {path: 'nowy', component: NewUserComponent},
            {
                path: '', component: UsersComponent, children: [
                    {path: ':id/:imie-naziwsko', component: UserSelectedComponent}
                ]
            }
        ])
    ]
})
export class UsersModule {
}
