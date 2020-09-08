import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TrainingModel} from '../../models/training.model';
import {faCaretRight} from '@fortawesome/free-solid-svg-icons/faCaretRight';
import {faCaretLeft} from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import {UserModel} from '../../models/user.model';
import {NgForm} from '@angular/forms';
import {PackagesTrainingsService} from '../../services/packages-trainings.service';
import {LocationService} from '../../services/location.service';
import {LocationModel} from '../../models/location.model';
import {UsersService} from '../../services/users.service';
import {CalendarItemModel} from '../../models/calendar-item.model';
import {PackageTypeModel} from '../../models/package-type.model';
import {DatePipe} from '@angular/common';

declare var $: any;

@Component({
    selector: 'app-user-calendar',
    templateUrl: './user-calendar.component.html',
    styleUrls: ['./user-calendar.component.css']
})
export class UserCalendarComponent implements OnInit {
    @Input('training') training: TrainingModel;
    @Input('user') owner: UserModel;
    @ViewChild('modalPlan') modal: ElementRef;
    @Output('packageUpdated') packageUpdated = new EventEmitter<void>();

    packageType: PackageTypeModel;
    defaultLocation: LocationModel;
    currWeekIndex = 0;
    today = new Date();
    weekStart: Date;
    weekEvents: Map<Date, CalendarItemModel[]> = new Map<Date, CalendarItemModel[]>();
    modalDate: Date;
    modalWeekDay: string;
    modalHours: string[] = [];
    modalMinutes: string[] = [];
    isModalSubmitting = false;
    isCalendarLoading = false;
    modalError: string = null;
    locations: LocationModel[];
    selectedHour: number = null;
    selectedMinutes: number = null;

    weekDays = ['pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd'];

    faCaretRight = faCaretRight;
    faCaretLeft = faCaretLeft;

    constructor(
        private service: PackagesTrainingsService,
        private locationService: LocationService,
        private userService: UsersService,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit() {
        this.isCalendarLoading = true;
        this.loadWeek(this.currWeekIndex);
        for (let h = 0; h < 24; h++) {
            if (h < 10) {
                this.modalHours.push('0' + h);
            } else {
                this.modalHours.push(String(h));
            }
        }
        for (let m = 0; m < 60; m = m + 5) {
            if (m < 10) {
                this.modalMinutes.push('0' + m);
            } else {
                this.modalMinutes.push(String(m));
            }
        }
        this.packageType = this.loadPackageType();
        this.locationService.getAllLocations().subscribe(loc => {
            this.locations = loc;
            for (let l of loc) {
                if (l.defaultLocation) {
                    this.defaultLocation = l;
                    break;
                }
            }
            this.isCalendarLoading = false;
        }, error => {
            this.userService.errorMessageSbj.next(error);
            this.isCalendarLoading = false;
        });

    }


    monthToString(monthNo: number): string {
        const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
        return months.slice(monthNo)[0];
    }


    loadWeek(ind: number) {
        this.isCalendarLoading = true;
        this.currWeekIndex = ind;
        const newDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + (7 * ind));
        this.weekStart = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + (1 - newDate.getDay()));
        this.weekEvents = null;
        this.service.getCalendarWeek(ind)
            .subscribe(events => {
                this.weekEvents = events;
                this.isCalendarLoading = false;
            }, error => {
                this.userService.errorMessageSbj.next(error);
                this.isCalendarLoading = false;
            });

    }

    planDay(day: { key: Date, value: CalendarItemModel[] }) {
        this.modalDate = new Date(day.key);
        this.modalWeekDay = this.service.dayToString(this.modalDate.getDay());
        this.onModalReset();
        $(this.modal.nativeElement).modal('show');
    }

    onTrainingPlanned(form: NgForm) {
        this.isModalSubmitting = true;
        this.modalError = null;
        const minutes = this.selectedMinutes ? this.modalMinutes[this.selectedMinutes] : '00';
        // let date = new Date(this.modalDate.setHours(+this.modalHours[this.selectedHour]));
        // date = new Date(date.setMinutes(+minutes));
        // const dateString = this.modalDate.getFullYear() + '-' + this.modalDate.getMonth() + '-' + this.modalDate.getDate() + 'T' + this.modalHours[this.selectedHour] + ':' + minutes + ':00';
        const dateString = this.datePipe.transform(this.modalDate, 'yyyy-MM-dd') + 'T' + this.modalHours[this.selectedHour] + ':' + minutes + ':00';
        const locationId = form.value.location.id;
        this.service.putTraining(this.training, {dateTime: dateString, locationId: locationId})
            .subscribe(t => {
                this.packageUpdated.emit();
                this.userService.infoMessageSbj
                    .next('Zaplanowany trening dla <strong>' + this.owner.name + ' ' + this.owner.surname + '</strong> na ' + new Date(t.scheduledFor).toLocaleDateString());
                this.isModalSubmitting = false;
                this.modalClose();
            }, error => {
                this.modalError = error;
                this.isModalSubmitting = false;
            });
    }

    onModalReset() {
        this.selectedMinutes = null;
        this.selectedHour = null;
    }

    modalClose() {
        this.onModalReset();
        $(this.modal.nativeElement).modal('hide');
    }

    returnDate(inputDate: string): number {
        const date = new Date(inputDate);
        return date.getDate();
    }

    returnMonthString(inputDate: string): string {
        const date = new Date(inputDate);
        return this.monthToString(date.getMonth());
    }

    returnHoursFromTo(item: CalendarItemModel): string {
        const dateStarts = new Date(item.eventStartsAt);
        const dateEnds = new Date(item.eventEndsAt);
        return dateStarts.toLocaleTimeString().slice(0, 5) + '-' + dateEnds.toLocaleTimeString().slice(0, 5);
    }

    onHourSelected(ind: number) {
        console.log(ind);
        this.selectedHour = ind;
    }

    private loadPackageType(): PackageTypeModel {
        return this.owner.trainingPackages.filter(p => p.trainings.includes(this.training))[0].packageType;
    }

}


