import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {LocationModel} from '../../models/location.model';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import {LocationService} from '../../services/location.service';
import {Subscription} from 'rxjs';
import {HttpService} from '../../services/http.service';

@Component({
    selector: 'app-settings-locations',
    templateUrl: './settings-locations.component.html',
    styleUrls: ['./settings-locations.component.scss']
})
export class SettingsLocationsComponent implements OnInit, OnDestroy {
    isLoading = false;
    infoMessage: string;
    errorMessage: string;
    newLocationButtonVisible: boolean = true;
    loadedLocations: LocationModel[] = [];

    isLoadingSub: Subscription;
    loadedLocationsSbjSub: Subscription;
    newLocationButtonVisibleSub: Subscription;
    errorMessageSub: Subscription;
    infoMessageSub: Subscription;

    faSyncAlt = faSyncAlt;

    constructor(
        private service: LocationService,
        private cdr: ChangeDetectorRef,
        private httpService: HttpService
    ) {}

    ngOnInit() {
        this.isLoadingSub = this.service.isLoading.subscribe(bool => {
                this.isLoading = bool;
            }
        );
        this.newLocationButtonVisibleSub = this.service.newLocationButtonVisible.subscribe(visible => {
            this.newLocationButtonVisible = visible;
            this.cdr.detectChanges();
        });
        this.loadedLocationsSbjSub = this.service.loadedLocationsSbj.subscribe(loaded => {
            this.loadedLocations = loaded;
        });
        this.errorMessageSub = this.httpService.topErrorBoxString.subscribe(msg => {
            this.errorMessage = msg;
        });
        this.infoMessageSub = this.service.topInfoBoxString.subscribe(msg => {
            this.infoMessage = msg;
        });
        if (this.loadedLocations.length === 0) {
            this.onFetchMore();
        }
    }

    ngOnDestroy() {
        this.isLoadingSub.unsubscribe();
        this.loadedLocationsSbjSub.unsubscribe();
        this.newLocationButtonVisibleSub.unsubscribe();
        this.errorMessageSub.unsubscribe();
        this.infoMessageSub.unsubscribe();
    }

    isLastPage(): boolean {
        return this.service.currentPageIsLast;
    }

    onFetchMore(): void {
        this.isLoading = true;
        this.service.loadNextSlice().subscribe(() => {
            this.isLoading = false;
        }, error => {
            this.errorMessage = error;
            this.isLoading = false;
        });
    }
}
