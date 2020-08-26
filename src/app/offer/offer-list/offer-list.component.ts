import {Component, OnDestroy, OnInit} from '@angular/core';
import {OfferService} from '../../services/offer.service';
import {PackageTypeModel} from '../../models/package-type.model';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import {HttpService} from '../../services/http.service';

@Component({
    selector: 'app-offer-list',
    templateUrl: './offer-list.component.html',
    styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit, OnDestroy {
    isLoading = false;
    newOfferButtonVisible = true;
    occurredErrorMessage: string;
    packageTypes: PackageTypeModel[];

    faSyncAlt = faSyncAlt;

    constructor(
        private service: OfferService,
        private httpService: HttpService
    ) {}

    ngOnInit() {
        this.service.isLoading.subscribe(bool => {
            this.isLoading = bool;
        });
        this.service.newOfferButtonVisible.subscribe(visible => {
            this.newOfferButtonVisible = visible;
        });
        this.service.loadedPackageTypesSbj.subscribe(loaded => {
            this.packageTypes = loaded;
        });
        if (this.packageTypes.length === 0) {
            this.onFetchMore();
        }
    }

    onFetchMore() {
        this.isLoading = true;
        this.service.loadNextSlice().subscribe(() => {
            this.isLoading = false;
        }, error => {
            this.occurredErrorMessage = error;
            this.isLoading = false;
        });
    }

    isLastPage(): boolean {
        return this.service.currentPageIsLast;
    }

    onFreshReload() {

    }

    ngOnDestroy() {

    }
}
