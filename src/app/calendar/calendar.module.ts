import {NgModule} from '@angular/core';
import {CalendarComponent} from './calendar.component';
import {CalendarItemComponent} from './calendar-item/calendar-item.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [
        CalendarComponent,
        CalendarItemComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    exports: [
        CalendarItemComponent
    ]
})
export class CalendarModule {}
