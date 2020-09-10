import {NgModule} from '@angular/core';
import {OfferComponent} from './offer.component';
import {OfferNewComponent} from './offer-new/offer-new.component';
import {OfferListComponent} from './offer-list/offer-list.component';
import {OfferListItemComponent} from './offer-list-item/offer-list-item.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        OfferComponent,
        OfferNewComponent,
        OfferListComponent,
        OfferListItemComponent
    ],
    imports: [
        FormsModule,
        RouterModule.forChild([
            {
            path: '', component: OfferComponent, children: [
                { path: 'nowa', component: OfferNewComponent }
            ]
        }]),
        SharedModule
    ]
})
export class OfferModule {}
