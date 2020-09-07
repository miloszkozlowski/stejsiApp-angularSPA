import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from '../../models/user.model';
import {UsersService} from '../../services/users.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, switchMap} from 'rxjs/operators';
import {faPhone} from '@fortawesome/free-solid-svg-icons/faPhone';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons/faEnvelope';
import {ViewportScroller} from '@angular/common';
import {faDumbbell} from '@fortawesome/free-solid-svg-icons/faDumbbell';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {PackageTypeModel} from '../../models/package-type.model';
import {OfferService} from '../../services/offer.service';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import {PackagesTrainingsService} from '../../services/packages-trainings.service';
import {NgForm} from '@angular/forms';
import {faInfo} from '@fortawesome/free-solid-svg-icons/faInfo';
import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import {faListOl} from '@fortawesome/free-solid-svg-icons/faListOl';

@Component({
    selector: 'app-user-selected',
    templateUrl: './user-selected.component.html'
})
export class UserSelectedComponent implements OnInit, OnDestroy {
    selectedUser: UserModel;
    selectedUserSub: Subscription;
    isLoading: boolean;
    isLoadingDetails: boolean;
    routerSub: Subscription;
    action: string = '';
    availablePackagesTypes: PackageTypeModel[];

    faPhone = faPhone;
    faEnvelope = faEnvelope;
    faDumbbell = faDumbbell;
    faBars = faBars;
    faCheckCircle = faCheckCircle;
    faInfo = faInfo;
    faCalendarAlt = faCalendarAlt;
    faListOl = faListOl;

    constructor(
        private route: ActivatedRoute,
        private service: UsersService,
        private offerService: OfferService,
        private packagesService: PackagesTrainingsService,
        private router: Router,
        private viewportScroller: ViewportScroller
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.selectedUserSub = this.route.params.pipe(
            switchMap(param => {
                return this.service.getUserById(param.id);
            })
        ).subscribe(user => {
            this.selectedUser = user;
            this.action = '';
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this.service.errorMessageSbj.next(error);
        });
        this.routerSub = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => this.viewportScroller.scrollToPosition([0, 0]));
    }

    ngOnDestroy() {
        this.selectedUserSub.unsubscribe();
        this.routerSub.unsubscribe();
    }

    onActionChosen(action: string) {
        this.action = action;
        if (action === 'newPackage') {
            this.loadAvailablePackages();
        }
    }

    loadAvailablePackages() {
        this.isLoadingDetails = true;
        this.offerService.getAllActivePackages()
            .subscribe(packages => {
                this.availablePackagesTypes = packages;
                this.isLoadingDetails = false;
            }, error => {
                this.service.errorMessageSbj = error;
                this.isLoadingDetails = false;
            });
    }

    onNewPackage(newPackageForm: NgForm) {
        this.isLoadingDetails = true;
        this.packagesService
            .openNewPackage(this.selectedUser.id, newPackageForm.form.value.typeId, this.selectedUser)
            .subscribe(tPackage => {
                this.service.infoMessageSbj
                    .next('<strong>' + tPackage.packageType.title + '</strong> został otwarty dla <strong>' + tPackage.owner.name + '</strong>. Można teraz planować treningi.');
                this.isLoadingDetails = false;
                this.onActionChosen('plan');
            }, err => {
                this.service.errorMessageSbj.next(err);
                this.isLoadingDetails = false;
            });
    }
}
