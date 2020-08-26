import {Component, OnDestroy, OnInit} from '@angular/core';
import {OfferService} from '../../services/offer.service';
import {NgForm} from '@angular/forms';
import {PackageTypeWriteModel} from '../../models/package-type-write.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ViewportScroller} from '@angular/common';

@Component({
    selector: 'app-offer-new',
    templateUrl: './offer-new.component.html'
})
export class OfferNewComponent implements OnInit, OnDestroy {
    occurredErrorMessage: string;
    isPosting = false;
    constructor(
        private service: OfferService,
        private router: Router,
        private route: ActivatedRoute,
        private viewportScroller: ViewportScroller
    ) {}
    ngOnInit() {
        this.service.newOfferButtonVisible.next(false);
    }
    ngOnDestroy() {
        this.service.newOfferButtonVisible.next(true);
    }
    onSubmit(newOfferForm: NgForm) {
        this.isPosting = true;
        this.occurredErrorMessage = null;
        console.log(newOfferForm);
        let toSave: PackageTypeWriteModel = newOfferForm.value;
        console.log(toSave);
        this.service.createNewPackageType(toSave).subscribe(() => {
            this.isPosting = false;
            this.afterSuccessfulPost();
        }, error => {
            this.occurredErrorMessage = error;
            this.isPosting = false;
        });
    }

    private afterSuccessfulPost() {
        this.viewportScroller.scrollToPosition([0, 0]);
        this.onCancelForm();
    }

    onCancelForm() {
        this.router.navigate(['..'], {relativeTo: this.route}).then();
    }
}
