import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {PackageModel} from '../models/package.model';
import {environment} from '../../environments/environment';
import {HttpService} from './http.service';
import {catchError, tap} from 'rxjs/operators';
import {UserModel} from '../models/user.model';
import {TrainingModel} from '../models/training.model';
import {CalendarItemModel} from '../models/calendar-item.model';

const ENDPOINT_PACKAGES = environment.serverPath + '/packages';
const ENDPOINT_TRAININGS = environment.serverPath + '/trainings';

@Injectable({providedIn: 'root'})
export class PackagesTrainingsService {

    constructor(
        private http: HttpClient,
        private httpService: HttpService
    ) {
    }

    openNewPackage(uid: number, typeId: number, owner: UserModel): Observable<PackageModel> {
        return this.http.post<PackageModel>(ENDPOINT_PACKAGES, {podopiecznyId: uid, rodzajPakietuId: typeId})
            .pipe(
                catchError(
                    err => {
                        return this.httpService.handleError(err);
                    }
                ), tap(tPackage => {
                    owner.trainingPackages.push(tPackage);
                    owner.activePackages.push(tPackage.id);
                })
            );
    }

    getUnplannedTrainings(pack: PackageModel) {
        let unplanned: TrainingModel[] = [];
        for (let t of pack.trainings) {
            if (!t.scheduledFor) {
                unplanned.push(t);
            }
        }
        return unplanned;
    }

    getPlannedTrainings(pack: PackageModel) {
        let unplanned: TrainingModel[] = [];
        for (let t of pack.trainings) {
            if (t.scheduledFor) {
                unplanned.push(t);
            }
        }
        return unplanned;
    }

    isPackageClosed(pack: PackageModel): boolean {
        for (let t of pack.trainings) {
            if (!t.markedAsDone) {
                return false;
            }
        }
        return pack.closed;
    }

    isReadyToBeClosed(pack: PackageModel): boolean {
        if (this.isPackageClosed(pack)) {
            return false;
        }
        const today = new Date();
        for (let t of pack.trainings) {
            if (today < new Date(t.scheduledFor) || !t.presenceConfirmedByUser) {
                return false;
            }
        }
        return true;
    }

    putTraining(
        training: TrainingModel,
        trainingData: { dateTime: String, locationId?: number }
    ): Observable<TrainingModel> {
        console.log(trainingData);
        return this.http.put<TrainingModel>(ENDPOINT_TRAININGS + '/' + training.id, trainingData)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                }),
                tap((t) => {
                    training.scheduledFor = t.scheduledFor;
                    training.location = t.location;
                    training.markedAsDone = null;
                    training.presenceConfirmedByUser = null;
                    training.scheduleConfirmed = null;
                    training.whenCanceled = null;
                })
            );
    }

    removeTraining(training: TrainingModel): Observable<any> {
        return this.http.delete(ENDPOINT_TRAININGS + '/' + training.id)
            .pipe(
                tap(() => {
                    training.whenCanceled = null;
                    training.markedAsDone = null;
                    training.scheduledFor = null;
                    training.scheduleConfirmed = null;
                    training.presenceConfirmedByUser = null;
                    training.location = null;
                }),
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

    closePackage(pack: PackageModel, user: UserModel) {
        let subs = [];
        subs.push(this.markPackageAsClosed(pack));
        for (let t of pack.trainings) {
            if (t.scheduledFor && !t.markedAsDone && t.presenceConfirmedByUser) {
                subs.push(this.markAsDone(t));
            }
        }
        return forkJoin(subs).pipe(
            tap(() => {
                user.activePackages = user.activePackages.filter(p => p !== pack.id);
                user.inactivePackages.push(pack.id);
            })
        );
    }

    markPackageAsClosed(pack: PackageModel): Observable<void> {
        return this.http.patch(ENDPOINT_PACKAGES + '/close/' + pack.id, pack)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                }),
                tap(() => {
                    pack.closed = true;
                })
            );
    }

    markAsDone(training: TrainingModel): Observable<TrainingModel> {
        return this.http.patch(ENDPOINT_TRAININGS + '/done/' + training.id, training)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                }),
                tap(t => {
                    training.markedAsDone = t.markedAsDone;
                })
            );
    }

    unCancel(training: TrainingModel): Observable<TrainingModel> {
        return this.http.patch(ENDPOINT_TRAININGS + '/uncancel/' + training.id, training)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                }),
                tap(t => {
                    training.whenCanceled = t.whenCanceled;
                })
            );
    }

    getCalendarWeek(weekIndex?: number): Observable<Map<Date, CalendarItemModel[]>> {
        return this.http.get<Map<Date, CalendarItemModel[]>>(environment.serverPath + '/calendar',
            {params: new HttpParams().set('week', weekIndex ? weekIndex.toString() : '0')})
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

    confirmPackagePaid(pack: PackageModel) {
        return this.http.patch(ENDPOINT_PACKAGES + '/paid/' + pack.id, pack)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                }),
                tap(() => {
                    pack.paid = !pack.paid;
                })
            );
    }

    dayToString(dayNo: number): string {
        const weekDaysFull = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'];
        return weekDaysFull.slice(dayNo - 1)[0];
    }

    getAllCanceledTrainings(): Observable<CalendarItemModel[]> {
        return this.http.get<CalendarItemModel[]>(environment.serverPath + '/calendar/canceled')
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

    getAllUnclosedPackages(): Observable<PackageModel[]> {
        return this.http.get<PackageModel[]>(ENDPOINT_PACKAGES + '/unclosed')
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

}
