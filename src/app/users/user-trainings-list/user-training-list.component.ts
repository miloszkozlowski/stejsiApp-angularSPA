import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {PackageModel} from '../../models/package.model';
import {TrainingModel} from '../../models/training.model';
import {PackagesTrainingsService} from '../../services/packages-trainings.service';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {faCalendarTimes} from '@fortawesome/free-solid-svg-icons/faCalendarTimes';
import {faUndo} from '@fortawesome/free-solid-svg-icons/faUndo';
import {faCalendarCheck} from '@fortawesome/free-solid-svg-icons/faCalendarCheck';
import {UsersService} from '../../services/users.service';

@Component({
    selector: 'app-user-training-list',
    templateUrl: './user-training-list.component.html',
    styleUrls: ['./user-training-list.component.css']
})
export class UserTrainingListComponent implements OnInit, OnChanges, AfterViewInit {
    @Input('package') package: PackageModel;
    @Input('editable') editable: boolean;
    @Output('packageUpdated') packageUpdated = new EventEmitter<void>();
    @Output('trainingToEdit') trainingToEdit = new EventEmitter<TrainingModel>();
    @ViewChildren('htmlLiElement') htmlLiElements: QueryList<ElementRef>;

    trainingsPlanned: TrainingModel[] = [];
    trainingsUnplanned: TrainingModel[] = [];
    today = new Date();

    faEdit = faEdit;
    faCalendarTimes = faCalendarTimes;
    faUndo = faUndo;
    faCalendarCheck = faCalendarCheck

    constructor(
        private service: PackagesTrainingsService,
        private userService: UsersService
    ) {
    }

    ngOnInit() {
        this.reloadTrainingsLists()
    }

    ngOnChanges(changes: SimpleChanges) {
        this.reloadTrainingsLists();
    }

    ngAfterViewInit() {
        if(this.editable) {
            this.htmlLiElements.forEach(li => li.nativeElement.setAttribute('data-toggle', 'dropdown'));
            this.htmlLiElements.forEach(li => li.nativeElement.setAttribute('role', 'button'));
        }
    }

    private reloadTrainingsLists() {
        this.trainingsPlanned = this.service.getPlannedTrainings(this.package);
        this.trainingsUnplanned = this.service.getUnplannedTrainings(this.package);
        this.trainingsPlanned.sort(((a, b) => {
            const aScheduledFor = new Date(a.scheduledFor);
            const bScheduledFor = new Date(b.scheduledFor);
            return (aScheduledFor > bScheduledFor) ? -1 : (bScheduledFor > aScheduledFor) ? 1 : 0;
        }));
        this.packageUpdated.emit();
    }

    isPast(input: Date): boolean {
        return new Date(input) < this.today;
    }

    onEdit(training: TrainingModel) {
        this.trainingToEdit.emit(training);
    }

    onRemove(training: TrainingModel) {
        this.service.removeTraining(training).subscribe(() => {
            this.userService.infoMessageSbj.next("Trening został usunięty");
            this.reloadTrainingsLists();
        }, err => {
            this.userService.errorMessageSbj.next(err);
        })
    }
    onUnCancel(training: TrainingModel) {
        this.service.unCancel(training).subscribe(() => {
            this.userService.infoMessageSbj.next("Termin treningu został przywrócony");
            this.reloadTrainingsLists();
        }, err => {
            this.userService.errorMessageSbj.next(err);
        });
    }
    onMarkAsDone(training: TrainingModel) {
        this.service.markAsDone(training).subscribe(() => {
            this.userService.infoMessageSbj.next("Trening został potwierdzony");
            this.reloadTrainingsLists();
        }, err => {
            this.userService.errorMessageSbj.next(err);
        });
    }

}
