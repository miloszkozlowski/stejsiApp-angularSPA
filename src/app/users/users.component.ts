import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../services/users.service';
import {UserModel} from '../models/user.model';
import {Subscription} from 'rxjs';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons/faSyncAlt';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: [
        './users.component.css',
        './users.component.scss'
    ]
})
export class UsersComponent implements OnInit, OnDestroy {
    isLoading = true;
    isLastPage = true;
    isSearchInProgress = false;
    isSearchInProgressSub: Subscription;
    isShowingSearchResults = false;
    errorMessage: string;
    infoMessage: string;
    filterSearchWord: string;
    usersFound: UserModel[] = [];
    searchPhraseSub: Subscription;
    loadedUsersSub: Subscription;
    errMsgSub: Subscription;
    infoMsgSub: Subscription;
    isLoadingSub: Subscription;
    isShowingSearchResultsSub: Subscription;
    keyWordSub: Subscription;

    faSyncAlt = faSyncAlt;

    constructor(
        private service: UsersService
    ) {}

    ngOnInit() {
        this.isLoadingSub = this.service.isLoading.subscribe(is => this.isLoading = is);

        this.isSearchInProgressSub = this.service.isPerformingSearch
            .subscribe(is => {
                this.isSearchInProgress = is;
            });

        this.keyWordSub = this.service.userSearchPhrase
            .subscribe(phrase => {
                this.filterSearchWord = phrase;
            });

        this.isShowingSearchResultsSub = this.service.isShowingSearchResults
            .subscribe(is => {
                this.isShowingSearchResults = is;
            });

        this.errMsgSub = this.service.errorMessageSbj.subscribe(errMsg => {
            this.errorMessage = errMsg;
        });

        this.infoMsgSub = this.service.infoMessageSbj.subscribe(nfo => {
            this.infoMessage = nfo;
        })

        this.loadedUsersSub = this.service.userLoadedSbj.subscribe(usersList => {
                if (usersList.length === 0 && !this.isSearchInProgress) {
                    this.onLoadMore();
                }
                else {
                    this.usersFound = usersList;
                }
            }
        );
    }

    ngOnDestroy() {
        this.errMsgSub.unsubscribe();
        this.loadedUsersSub.unsubscribe();
        this.isLoadingSub.unsubscribe();
        this.isSearchInProgressSub.unsubscribe();
        this.isShowingSearchResultsSub.unsubscribe();
        this.keyWordSub.unsubscribe();
        this.infoMsgSub.unsubscribe();
        this.service.userSearchClearField.next();
    }

    onShowAll() {
        this.service.userSearchClearField.next();
        this.isShowingSearchResults = false;
    }

    onLoadMore() {
        this.service.getNextUsersSlice()
            .subscribe(() => {
                this.isShowingSearchResults = false;
                this.isLastPage = this.service.isLastPage;
            }, error => this.errorMessage = error);
    }
}
