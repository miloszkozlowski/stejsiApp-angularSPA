import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {HomeScreenComponent} from './home-screen.component';
import {CalendarModule} from '../calendar/calendar.module';

@NgModule({
    declarations: [
        HomeScreenComponent
    ],
    imports: [
        SharedModule,
        CalendarModule,
        RouterModule.forChild([
            {path: '', component: HomeScreenComponent}
        ])
    ]
})
export class HomeScreenModule {}
