import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {TipModel} from '../models/tip.model';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {PageModel} from '../models/pagination/page.model';
import {TipCommentModel} from '../models/tip-comment.model';
import {tap} from 'rxjs/operators';

const TIPS_PER_PAGE = '10';
const ENDPOINT = environment.serverPath + '/tips';

@Injectable({
    providedIn: 'root'
})
export class TipService{

    loadedTips: TipModel[] = [];
    lastLoadedPage: PageModel<TipModel>;
    newPage = new Subject<PageModel<TipModel>>();
    tipLoadError = new Subject<Error>();
    newTipError = new Subject<Error>();
    tipsListLoading = new Subject<boolean>();
    isNotifyPossibleSbj = new Subject<boolean>();
    tipsListRestart = new Subject();
    newTipButtonVisible = new Subject<boolean>();
    newTipIsPosting = new Subject<boolean>();
    newTipPostedId = new Subject<number>();

    constructor(private http: HttpClient) {}
    
    getTipById(id: number): Observable<any> {
        return this.http.get<TipModel>(environment.serverPath + '/tips/' + id);
    }

    reloadTipsList() {
        this.tipsListRestart.next();
        this.tipsListLoading.next(true);
        this.loadedTips = [];
        this.lastLoadedPage = null;
        this.getTipsPage();
    }

    getTipsPage() {
        const pageNumber = this.lastLoadedPage ? this.lastLoadedPage.number + 1 : 0;
        let loadAllowed = true;
        if(this.lastLoadedPage) {
            if(this.lastLoadedPage.last) {
                loadAllowed = false;
            }
        }

        if(loadAllowed) {
            this.tipsListLoading.next(true);
            const httpParams = new HttpParams()
                .set('page', pageNumber + '')
                .set('size', TIPS_PER_PAGE)
                .set('sort', 'whenCreated,desc');
            this.http
                .get<PageModel<TipModel>>(environment.serverPath + '/tips', {params: httpParams})
                .subscribe(page => {
                    this.loadedTips.push(...page.content);
                    this.newPage.next(page);
                    this.lastLoadedPage = page;
                    this.tipsListLoading.next(false);
                }, error => {
                    this.tipLoadError.next(error);
                    this.tipsListLoading.next(false);
                });
        }
    }


    postNewTip(writeObject: { heading: string; imageUrl: string; uploadedImage: any; body: string }) {
        this.newTipIsPosting.next(true);
        this.http.post<TipModel>(environment.serverPath + '/tips/add', writeObject)
            .pipe(
                tap(() => {
                    this.isNotificationPossible().subscribe(is => {
                        this.isNotifyPossibleSbj.next(is);
                    });
                })
            )
            .subscribe(resp => {
            this.newTipPostedId.next(resp.id);
            this.newTipIsPosting.next(false);
        }, error => {
            this.newTipIsPosting.next(false);
            this.newTipError.next(error);
        })
    }

    deleteTipById(id: number): Observable<any> {
        return this.http.delete(environment.serverPath + '/tips/' + id);
    }

    addNewComment(writeObject: {tipId: number; body: string}): Observable<any> {
        return this.http.post<TipCommentModel>(environment.serverPath + '/tips/comments', writeObject);
    }

    isNotificationPossible(): Observable<boolean> {
        return this.http.get<boolean>(ENDPOINT + '/notifypossible');
    }

    notifyUsersOnNewPosts(): Observable<any> {
        return this.http.get(ENDPOINT + '/notifyusers');
    }

}
