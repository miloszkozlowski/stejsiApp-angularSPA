import {Component, OnInit} from '@angular/core';
import {OfferService} from '../services/offer.service';
import {HttpService} from '../services/http.service';

@Component({
    selector: 'app-offer',
    templateUrl: './offer.component.html'
})
export class OfferComponent implements OnInit {
    errorMessage : string;
    infoMessage: string;

    constructor(
        private service: OfferService,
        private httpService: HttpService
    ) {}

    ngOnInit() {
        this.service.topInfoBoxString.subscribe(str => {
            this.infoMessage = str;
        });
        this.httpService.topErrorBoxString.subscribe(str => {
            this.errorMessage = str;
        });
    }
}
