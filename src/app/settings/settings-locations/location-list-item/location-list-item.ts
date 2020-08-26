import {Component, Input} from '@angular/core';
import {LocationModel} from '../../../models/location.model';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import {LocationService} from '../../../services/location.service';
import {faCheckDouble} from '@fortawesome/free-solid-svg-icons/faCheckDouble';

@Component({
    selector: 'app-location-list-item',
    templateUrl: './location-list-item.component.html'
})
export class LocationListItem {
    @Input('location') location: LocationModel;
    isLoading = false;

    faEllipsisV = faEllipsisV;
    faTrash = faTrash;
    faCheckDouble = faCheckDouble;

    constructor(
        private service: LocationService
    ) {
    }

    onRemove(id: number): void {
        this.isLoading = true;
        this.service.removalRequest(id).subscribe(() => {
                this.isLoading = false;
            }, error => {
                this.isLoading = false;
            }
        );
    }
    onSetDefault(id: number) {
        this.isLoading = true;
        this.service.setDefault(id).subscribe(() => {
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        })
    }

}
