import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {UsersService} from '../services/users.service';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'app-user-search-form',
    templateUrl: './user-search.component.html'
})
export class UserSearchFormComponent implements OnInit, OnDestroy {
    searchKeyWord = new FormControl();
    currentRoute;
    searchKeyWordSub: Subscription;
    inputClearSub: Subscription;
    currentSearchKeyLength = 0
    isShowingSearchResults = false;

    faSearch = faSearch;

    @ViewChild('inputField') field: ElementRef;

    constructor(
        private router: Router,
        private userService: UsersService
    ) {}

    ngOnInit(): void {
        this.searchKeyWordSub = this.searchKeyWord.valueChanges
            .pipe(
                tap((searchKey) => {
                    this.currentSearchKeyLength = searchKey ? searchKey.length : 0;
                    if (searchKey && searchKey.length > 0 && searchKey.length < 3) {
                        this.tooltipFire();
                    } else {
                        this.tooltipHide();
                    }
                    if(searchKey === '') {
                        this.tooltipHide();
                        this.userService.onResetSearchResults();
                    }
                }),
                filter(searchKey => searchKey && searchKey.length > 2),
                distinctUntilChanged(),
                debounceTime(600),
                tap(() => {
                    this.userService.isPerformingSearch.next(true);
                    if (this.router.url !== '/podopieczni') {
                        this.router.navigate(['/podopieczni']).then();
                    }
                }),
                switchMap(zap => {
                    return this.userService.performSearchQuery(zap);
                })
            ).subscribe(() => {
                this.isShowingSearchResults = true;
            }, error => this.userService.errorMessageSbj.next(error));

        this.inputClearSub = this.userService.userSearchClearField.subscribe(() => {
            this.searchKeyWord.setValue('');
            this.tooltipHide();
        });
    }

    ngOnDestroy() {
        this.searchKeyWordSub.unsubscribe();
        this.inputClearSub.unsubscribe();
    }

    tooltipFire() {
        setTimeout(() => {
            if (this.searchKeyWord.value.length < 3) {
                $(this.field.nativeElement).tooltip('show');
            }
        }, 2000);

    }

    tooltipHide() {
        $(this.field.nativeElement).tooltip('hide');
    }

}
