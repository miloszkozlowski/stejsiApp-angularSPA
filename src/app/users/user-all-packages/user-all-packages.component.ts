import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UserModel} from '../../models/user.model';
import {PackageModel} from '../../models/package.model';

@Component({
    selector: 'app-user-all-packages',
    templateUrl: './user-all-packages.component.html'
})
export class UserAllPackagesComponent implements OnInit {
    @Input(`user`) user: UserModel;
    @ViewChild('packageModal') modal: ElementRef;

    activePackages: PackageModel[] = [];
    inactivePackages: PackageModel[] = [];
    modalPack: PackageModel;
    isPaymentLoading = false;

    constructor() {}

    ngOnInit() {
        this.makePackagesList();

    }

    makePackagesList() {
        this.activePackages = [];
        this.inactivePackages = [];
        for(let pack of this.user.trainingPackages) {
            if(this.user.activePackages.filter(p => p === pack.id).length > 0) {
                this.activePackages.push(pack);
            }
            else {
                this.inactivePackages.push(pack);
            }
        }
    }

    onPackageDetailShow(pack: PackageModel) {
        this.modalPack = pack;
    }

}
