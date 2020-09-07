import {Injectable, Output, EventEmitter} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {HttpService} from './http.service';
import {PageModel} from '../models/pagination/page.model';
import {LocationModel} from '../models/location.model';

const ENDPOINT = environment.serverPath + '/locations';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    isLoading = new Subject<boolean>();
    newLocationButtonVisible = new Subject<boolean>();
    currentPageToLoad = 0;
    currentPageIsLast = false;
    loadedLocations: LocationModel[] = [];
    loadedLocationsSbj = new BehaviorSubject<LocationModel[]>([]);
    topInfoBoxString = new Subject<string>();

    @Output()
    errorMessage = new EventEmitter<string>();


    constructor(private http: HttpClient, private httpService: HttpService) {
    }

    createNewLocation(location: LocationModel): Observable<LocationModel> {
        return this.http
            .post<LocationModel>(ENDPOINT, location)
            .pipe(
                switchMap(location => {
                    this.restartLoad();
                    this.topInfoBoxString.next('Lokalizacja "' + location.name + '" została dodana');
                    return this.loadNextSlice();
                }),
                catchError(err => {
                    return this.httpService.handleError(err);
                }));
    }

    loadNextSlice(): Observable<LocationModel> {
        this.isLoading.next(true);
        const params = new HttpParams().set('page', String(this.currentPageToLoad));
        return this.http
            .get<PageModel<LocationModel>>(ENDPOINT, {params: params})
            .pipe(tap(page => {
                this.httpService.topErrorBoxString.next(null);
                this.isLoading.next(false);
                this.currentPageIsLast = page.last;
                this.currentPageToLoad = page.number + 1;
                this.loadedLocations.push(...page.content);
                // this.loadedLocations = this.removeDuplicates<PackageTypeModel>(this.loadedLocations);
                this.loadedLocationsSbj.next(this.loadedLocations);
            }), catchError(err => {
                this.isLoading.next(false);
                return this.httpService.handleError(err);
            }));
    }

    removalRequest(id: number): Observable<void> {
        let toRemove: LocationModel;
        for (let l of this.loadedLocations) {
            if (l.id == id) {
                toRemove = l;
            }
        }
        return this.http
            .delete(ENDPOINT + '/' + id)
            .pipe(
                switchMap(() => {
                    this.topInfoBoxString.next('Lokalizacja "' + toRemove.name + '" została pomyślnie usunięta');
                    this.restartLoad();
                    return this.loadNextSlice();
                }),
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

    restartLoad(): void {
        this.loadedLocations = [];
        this.currentPageToLoad = 0;
        this.loadedLocationsSbj.next([]);
    }

    setDefault(id: number): Observable<void> {
        let toSetDefault: LocationModel;
        for (let l of this.loadedLocations) {
            if (l.id == id) {
                toSetDefault = l;
            }
        }
        return this.http.patch(ENDPOINT + '/setdefault/' + id, toSetDefault)
            .pipe(
                tap(() => {
                    this.topInfoBoxString.next('Lokalizacja "' + toSetDefault.name + '" jest teraz domyślną');
                    for (let l of this.loadedLocations) {
                        if (l.defaultLocation) {
                            l.defaultLocation = false;
                        }
                    }
                    toSetDefault.defaultLocation = true;
                    this.loadedLocationsSbj.next(this.loadedLocations);
                }),
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

    getAllLocations(): Observable<LocationModel[]> {
        return this.http.get<LocationModel[]>(ENDPOINT + '/all')
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }
}
