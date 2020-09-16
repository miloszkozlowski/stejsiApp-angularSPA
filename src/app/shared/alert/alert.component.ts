import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html'
})
export class AlertComponent {
    @Input('message') message: string;
    @Input('header') header: string;
    @Input('confirmBody') confirmBody: string;
    @Input('modal') modal = 'alertModal';
    @Output('confirmed') confirmed = new EventEmitter<void>();

    onConfirm() {
        this.confirmed.emit();
    }

}
