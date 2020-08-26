import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpService} from './http.service';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {SettingsModel} from '../models/settings.model';

export const ENDPOINT = '/settings';

@Injectable({providedIn: 'root'})
export class SettingsService {
    loadingStatus = new Subject<boolean>();

    constructor(private http: HttpClient, private httpService: HttpService) {
    }

    loadGeneralSettings(): Observable<SettingsModel> {
        this.loadingStatus.next(true);
        return this.http.get<SettingsModel>(environment.serverPath + ENDPOINT)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                 })
            );
    }
    saveSettings(settings: SettingsModel): Observable<SettingsModel> {
        this.loadingStatus.next(true);
        settings.whenCreated = null;
        settings.id = null;
        return this.http.post<SettingsModel>(environment.serverPath + ENDPOINT, settings)
            .pipe(
                catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

}
