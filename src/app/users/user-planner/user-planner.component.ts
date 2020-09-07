import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UserModel} from '../../models/user.model';
import {PackageModel} from '../../models/package.model';
import {PackagesTrainingsService} from '../../services/packages-trainings.service';
import {TrainingModel} from '../../models/training.model';
import {faDumbbell} from '@fortawesome/free-solid-svg-icons/faDumbbell';
import {Subject} from 'rxjs';
import {UsersService} from '../../services/users.service';

@Component({
    selector: 'app-user-planner',
    templateUrl: 'user-planner.component.html'
})
export class UserPlannerComponent implements OnInit, OnChanges {

    @Input('user') user: UserModel;
    @Output('actionTo') actionTo = new EventEmitter<string>();
    packageToBePlanned: PackageModel;
    packageToBePlannedSbj = new Subject<PackageModel>();
    trainingToPlan: TrainingModel;

    plannedTrainings: TrainingModel[] = [];
    unPlannedTrainings: TrainingModel[] = [];

    activePackages: PackageModel[] = [];
    inactivePackages: PackageModel[] = [];
    isReadyToBeClosed = false;
    isPosting = false;
    editMode = false;

    faDumbbell = faDumbbell;

    constructor(
        public packService: PackagesTrainingsService,
        private userService: UsersService
    ) {
    }

    ngOnInit() {
        this.loadNewUser(this.user);
    }

    ngOnChanges(changes: SimpleChanges) {
        // if(this.packageToBePlanned) {
        //     this.reloadTrainingsInPackage();
        // }
        if(changes.user) {
            this.loadNewUser(changes.user.currentValue);
        }
    }

    private loadNewUser(user: UserModel) {
        this.packageToBePlanned = null;
        for (let pack of this.user.trainingPackages) {
            if (!this.packService.isPackageClosed(pack)) {
                this.loadPackageToPlan(pack);
                break;
            }
        }
        if(!this.packageToBePlanned) {
            this.packageToBePlannedSbj.next(null);
            this.isReadyToBeClosed = false;
        }
        this.reloadUserPackages();
    }

    onGoToNewPackage() {
        this.actionTo.emit('newPackage');
    }

    loadPackageToPlan(pack: PackageModel) {
        this.packageToBePlanned = pack;
        this.packageToBePlannedSbj.next(pack);
        this.reloadTrainingsInPackage();
        this.isReadyToBeClosed = this.packService.isReadyToBeClosed(pack);
    }

    reloadTrainingsInPackage() {
        this.unPlannedTrainings = this.packService.getUnplannedTrainings(this.packageToBePlanned);
        this.plannedTrainings = this.packService.getPlannedTrainings(this.packageToBePlanned);
        this.trainingToPlan = null;
    }

    onTrainingEdit(training: TrainingModel) {
        this.trainingToPlan = training;
        this.editMode = true;
    }

    reloadUserPackages() {
        this.activePackages = [];
        for(let p of this.user.trainingPackages) {
            if(this.user.activePackages.includes(p.id)) {
                this.activePackages.push(p);
            }
        }
        this.inactivePackages = [];
        for(let p of this.user.trainingPackages) {
            if(this.user.inactivePackages.includes(p.id)) {
                this.inactivePackages.push(p);
            }
        }
    }

    planNextTraining() {
        this.editMode = false;
        for(let t of this.packageToBePlanned.trainings) {
            if(!t.scheduledFor) {
                this.trainingToPlan = t;
                break;
            }
        }
    }

    onClosePackage() {
        this.isPosting = true;
        this.packService.closePackage(this.packageToBePlanned, this.user).subscribe(() => {
            this.reloadTrainingsInPackage();
            this.reloadUserPackages();
            this.userService.infoMessageSbj.next('Pakiet został zamknięty i zarchiwizowany');
            this.isReadyToBeClosed = false;
            this.isPosting = false;
        }, error => {
            this.userService.errorMessageSbj.next(error[0]);
            this.isPosting = false;
        })
    }

}
