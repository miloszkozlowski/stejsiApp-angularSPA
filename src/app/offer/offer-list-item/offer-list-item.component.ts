import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {PackageTypeModel} from '../../models/package-type.model';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import {OfferService} from '../../services/offer.service';
import {ViewportScroller} from '@angular/common';

@Component({
    selector: 'app-offer-list-item',
    templateUrl: './offer-list-item.component.html'
})
export class OfferListItemComponent implements AfterViewInit {
    @Input('offer') packageType: PackageTypeModel;
    isLoading = false;

    faEllipsisV = faEllipsisV;
    faTrash = faTrash

    constructor(
        private service: OfferService,
        private viewportScroller: ViewportScroller
    ) {}

    onRemove() {
        this.isLoading = true;
        this.service.removalRequest(this.packageType.id).subscribe(() => {
            this.isLoading = false;
            this.viewportScroller.scrollToPosition([0,0]);
        }, error => {
            this.isLoading = false;
            this.viewportScroller.scrollToPosition([0, 0]);
        });
    }

    ngAfterViewInit() {

    }
}
