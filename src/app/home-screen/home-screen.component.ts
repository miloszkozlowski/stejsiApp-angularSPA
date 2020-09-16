import {Component, OnInit} from '@angular/core';
import {PackagesTrainingsService} from '../services/packages-trainings.service';
import {CalendarItemModel} from '../models/calendar-item.model';
import {DatePipe} from '@angular/common';
import {PackageModel} from '../models/package.model';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-home-screen',
    templateUrl: './home-screen.component.html',
    styleUrls: [
        './home-screen.component.css',
        './home-screen.component.scss'
    ]
})
export class HomeScreenComponent implements OnInit {

    isCalendarLoading = false;
    isPackageClosing = false;
    isUnclosedPackagesLoading = false;
    packagesReadyToBeClosed: PackageModel[] = [];
    loadedDay: CalendarItemModel[] = [];
    loadedCanceledTrainings: CalendarItemModel[] = [];
    loadedUnclosedPackages: PackageModel[] = [];
    infoMessage: string;
    errorMessage: string;

    constructor(
        private trainingService: PackagesTrainingsService,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit(): void {
        this.loadCalendar();
        this.loadCanceledTrainings();
        this.loadUnclosedPackages();
    }

    loadCalendar() {
        this.isCalendarLoading = true;
        const today = this.datePipe.transform(Date.now(), 'yyyy-MM-ddT00:00');
        this.trainingService.getCalendarWeek()
            .subscribe(week => {
                Object.keys(week).forEach(k => {
                    if (today === k) {
                        this.loadedDay = week[k];
                    }
                });
                this.isCalendarLoading = false;
            }, error => {
                this.errorMessage = error;
                this.isCalendarLoading = false;
            });
    }

    loadCanceledTrainings() {
        this.trainingService.getAllCanceledTrainings()
            .subscribe(canceledList => {
                this.loadedCanceledTrainings = canceledList;
            }, err => {
                this.errorMessage = err;
            });
    }

    loadUnclosedPackages() {
        this.isUnclosedPackagesLoading = true;
        this.trainingService.getAllUnclosedPackages()
            .subscribe(unclosedList => {
                this.isUnclosedPackagesLoading = false;
                this.loadedUnclosedPackages = unclosedList;
                this.getPackagesReadyToBeClosed();
            }, err => {
                this.isUnclosedPackagesLoading = false;
                this.errorMessage = err;
            });
    }

    getPackagesReadyToBeClosed() {
        for (let pack of this.loadedUnclosedPackages) {
            this.packagesReadyToBeClosed = [];
            if (this.isReadyToBeClosed(pack)) {
                this.packagesReadyToBeClosed.push(pack);
            }
        }
    }

    isReadyToBeClosed(pack: PackageModel): boolean {
        return this.trainingService.isReadyToBeClosed(pack);
    }

    onClosePackages() {
        this.isPackageClosing = true;
        const packsToCloseSubs = [];
        for (let pack of this.packagesReadyToBeClosed) {
            packsToCloseSubs.push(this.trainingService.closePackage(pack, pack.owner));
        }
        forkJoin(packsToCloseSubs)
            .subscribe(() => {
                this.isPackageClosing = false;
                this.loadUnclosedPackages();
                this.infoMessage = 'Wszystkie pakiety, które były gotowe do zamknięcia zostały zamknięte';
            }, err => {
                this.isPackageClosing = false;
                this.errorMessage = err;
            });
    }

    getAmountUnplanned(pack: PackageModel): number {
        return this.trainingService.getUnplannedTrainings(pack).length;
    }

}
