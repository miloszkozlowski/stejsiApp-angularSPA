import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {InfoFlowModel} from '../models/info-flow.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {HttpService} from './http.service';

export const ENDPOINT = environment.serverPath + '/info';

@Injectable({providedIn: 'root'})
export class InfoFlowService {
    loadedFlow: InfoFlowModel;
    loadedFlowSbj = new BehaviorSubject<InfoFlowModel>(null);

    constructor(
        private http: HttpClient,
        private httpService: HttpService
    ) {}

    loadFlow(): Observable<any> {
        return this.http.get<InfoFlowModel>(ENDPOINT)
            .pipe(
                tap(infoFlow => {
                    this.loadedFlow = infoFlow;
                    this.loadedFlowSbj.next(this.loadedFlow);
                }), catchError(err => {
                    return this.httpService.handleError(err);
                })
            );
    }

}
