import {Component, Input} from '@angular/core';
import {CalendarItemModel} from '../../models/calendar-item.model';

@Component({
    selector: 'app-calendar-item',
    templateUrl: './calendar-item.component.html'
})
export class CalendarItemComponent {
    @Input('item') item: CalendarItemModel;
    @Input('homeScreen') homeScreen: boolean = false;
    today = new Date();

    isPast(): boolean {
        return new Date(this.item.eventEndsAt) < this.today;
    }
}
