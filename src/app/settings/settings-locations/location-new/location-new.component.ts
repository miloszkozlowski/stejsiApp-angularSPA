import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {LocationService} from '../../../services/location.service';
import {NgForm} from '@angular/forms';
import {LocationModel} from '../../../models/location.model';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-location-new',
    templateUrl: './location-new.component.html'
})
export class LocationNewComponent implements AfterViewInit, OnDestroy {

    isPosting = false;

    constructor(
        private service: LocationService,
        private httpService: HttpService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngAfterViewInit(): void {
        this.service.newLocationButtonVisible.next(false);

    }

    ngOnDestroy() {
        this.service.newLocationButtonVisible.next(true);
    }

    onSubmit(newLocationForm: NgForm) {
        this.isPosting = true;
        const newLocation: LocationModel = newLocationForm.value;
        if(!newLocation.defaultLocation) {
            newLocation.defaultLocation = false;
        }
        this.service.createNewLocation(newLocation).subscribe(() => {
            this.isPosting = false;
            this.router.navigate(['..'], {relativeTo: this.route}).then();
        }, error => {
            this.isPosting = false;
        });
    }
}
