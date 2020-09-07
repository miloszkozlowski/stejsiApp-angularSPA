import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PackageModel} from '../../../models/package.model';
import {PackagesTrainingsService} from '../../../services/packages-trainings.service';
import {TrainingModel} from '../../../models/training.model';
import {UserModel} from '../../../models/user.model';

declare var $: any;

@Component({
    selector: 'app-package-modal',
    templateUrl: './user-package-modal.component.html'
})
export class UserPackageModalComponent implements OnInit, AfterViewInit {
    @Input('package') selectedPack: PackageModel;
    @Input('user') owner: UserModel;
    @ViewChild('packageModal') packageModal: ElementRef;
    @Output('closed') closed = new EventEmitter<void>();
    @Output('packageClosed') packageClosed = new EventEmitter<void>();

    isPaymentLoading = false;
    plannedTrainings: TrainingModel[] = [];
    unplannedTrainings: TrainingModel[] = [];
    isReadyToBeClosed = false;
    isClosing = false;
    infoMessage: string;


    constructor(
        private packageService: PackagesTrainingsService
    ) {}

    ngOnInit(): void {
        this.plannedTrainings = this.packageService.getPlannedTrainings(this.selectedPack);
        this.unplannedTrainings = this.packageService.getUnplannedTrainings(this.selectedPack);
        this.isReadyToBeClosed = this.packageService.isReadyToBeClosed(this.selectedPack);
    }

    ngAfterViewInit(): void {
        $(this.packageModal.nativeElement).on('hidden.bs.modal', () => {
           this.onModalClose();
        });
        $(this.packageModal.nativeElement).modal('show');
    }

    onPaidConfirmed($event) {
        if($event.target.checked) {
            this.isPaymentLoading = true;
            this.packageService.confirmPackagePaid(this.selectedPack)
                .subscribe(() => {
                    this.isPaymentLoading = false;
                }, error => {
                    this.isPaymentLoading = false;
                })
        }
    }

    onModalClose() {
        this.closed.emit();
    }

    onClosePackage() {
        this.isClosing = true;
        this.packageService.closePackage(this.selectedPack, this.owner)
            .subscribe(() => {
                this.isClosing = false;
                this.infoMessage = 'Pakiet został zarchiwizowany';
                this.isReadyToBeClosed = false;
                this.packageClosed.emit();
            },error => {
                this.isClosing = false;
                this.infoMessage = 'Błąd (' + error + '). Spróbuj ponownie.';
            });
    }
}
