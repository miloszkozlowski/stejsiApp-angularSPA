import {NgModule} from '@angular/core';
import {AlertComponent} from './alert/alert.component';
import {MinimumNumberValidator} from '../models/validators/minimum-number.validator';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {LoadingSpinnerLgComponent} from './loading-spinner-lg/loading-spinner-lg.component';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {UserSearchFormComponent} from '../user-search-form/user-search-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        AlertComponent,
        MinimumNumberValidator,
        LoadingSpinnerComponent,
        LoadingSpinnerLgComponent,
        UserSearchFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule
    ],
    exports: [
        AlertComponent,
        MinimumNumberValidator,
        LoadingSpinnerComponent,
        LoadingSpinnerLgComponent,
        UserSearchFormComponent,
        CommonModule,
        FontAwesomeModule
    ]
})
export class SharedModule {}
