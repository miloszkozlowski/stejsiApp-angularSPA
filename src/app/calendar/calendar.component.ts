import {Component, OnInit} from '@angular/core';
import {PackagesTrainingsService} from '../services/packages-trainings.service';
import {CalendarItemModel} from '../models/calendar-item.model';
import {faCaretLeft} from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import {faCaretRight} from '@fortawesome/free-solid-svg-icons/faCaretRight';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
    })
export class CalendarComponent implements OnInit {

    isLoading = false;
    errorMessage: string;
    infoMessage: string;
    today: string;
    loadedWeek: Map<Date, CalendarItemModel[]>;
    currentWeekNo = 0;

    faCaretLeft = faCaretLeft;
    faCaretRight = faCaretRight;

    constructor(
        private service: PackagesTrainingsService,
        private datePipe: DatePipe
    ) {}

    ngOnInit() {
        this.today = this.datePipe.transform(Date.now(), 'yyyy-MM-ddT00:00');
        this.loadWeek();
    }

    loadWeek(weekNo?: number) {
        this.isLoading = true;
        this.service.getCalendarWeek(weekNo)
            .subscribe(week => {
                this.loadedWeek = week;
                this.currentWeekNo = weekNo ? weekNo : 0;
                this.isLoading = false;
            }, error => {
                this.errorMessage = error;
                this.isLoading = false;
            });
    }
}
