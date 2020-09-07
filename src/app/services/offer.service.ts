import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PackageTypeWriteModel} from '../models/package-type-write.model';
import {environment} from '../../environments/environment';
import {PackageTypeModel} from '../models/package-type.model';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {HttpService} from './http.service';
import {PageModel} from '../models/pagination/page.model';

export const ENDPOINT = environment.serverPath + '/packagetypes'

@Injectable({
    providedIn: 'root'
})
export class OfferService {
    isLoading = new Subject<boolean>();
    newOfferButtonVisible = new Subject<boolean>();
    currentPageToLoad = 0;
    currentPageIsLast = false;
    loadedPackageTypes: PackageTypeModel[] = [];
    loadedPackageTypesSbj = new BehaviorSubject<PackageTypeModel[]>([]);
    topInfoBoxString = new Subject<string>();

    constructor(private http: HttpClient, private httpService: HttpService) {
    }

    createNewPackageType(packageType: PackageTypeWriteModel): Observable<any> {
        return this.http
            .post<PackageTypeModel>(ENDPOINT, packageType)
            .pipe(
                switchMap(resp => {
                    this.restartLoad();
                    this.topInfoBoxString.next('Oferta "' + resp.title + '" została dodana');
                    return this.loadNextSlice();
                }),
                catchError(err => {
                return this.httpService.handleError(err);
            }));
    }

    loadNextSlice(): Observable<any> {
        this.isLoading.next(true);
        const params = new HttpParams().set('page', String(this.currentPageToLoad));
        return this.http
            .get<PageModel<PackageTypeModel>>(ENDPOINT, {params: params})
            .pipe(tap(page => {
                this.httpService.topErrorBoxString.next(null);
                this.isLoading.next(false);
                this.currentPageIsLast = page.last;
                this.currentPageToLoad = page.number + 1;
                this.loadedPackageTypes.push(...page.content);
                this.loadedPackageTypes.push(...page.content);
                this.loadedPackageTypes = this.removeDuplicates<PackageTypeModel>(this.loadedPackageTypes);
                this.loadedPackageTypesSbj.next(this.loadedPackageTypes);
            }), catchError(err => {
                this.isLoading.next(false);
                return this.httpService.handleError(err);
            }));
    }

    removalRequest(id: number): Observable<any> {
        let toRemove: PackageTypeModel;
        for(let p of this.loadedPackageTypes) {
            if (p.id == id) {
                toRemove = p;
            }
        }
        return this.http
            .delete(ENDPOINT + '/' + id)
            .pipe(
                // tap(() => {
                //     for (let i = 0; i < this.loadedPackageTypes.length; i++) {
                //         console.log('Sprawdzanie elementu: ' + i);
                //         if (this.loadedPackageTypes[i].id === id) {
                //             console.log('Jest element do usunięcia: ' + i);
                //             this.loadedPackageTypes.splice(i, 1);
                //         }
                //     }
                //     this.loadedPackageTypesSbj.next(this.loadedPackageTypes);
                // }),
                switchMap(() => {
                    this.topInfoBoxString.next('Pakiet treningów "' + toRemove.title + '" usunięty z oferty')
                    this.restartLoad();
                    return this.loadNextSlice();
                }),
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

    restartLoad(): void {
        this.loadedPackageTypes = [];
        this.currentPageToLoad = 0;
        this.loadedPackageTypesSbj.next([]);
    }

    private removeDuplicates<T>(data: T[]): T[] {
        return data.filter((value, index) => data.indexOf(value) === index);
    }

    getAllActivePackages(): Observable<PackageTypeModel[]> {
        return this.http.get<PackageTypeModel[]>(ENDPOINT + '/all')
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

    getPackageTypeById(packTypeId: number): Observable<PackageTypeModel> {
        return this.http.get<PackageTypeModel>(ENDPOINT + '/' + packTypeId)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }
}
