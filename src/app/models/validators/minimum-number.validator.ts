import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive, Injectable, Input} from '@angular/core';

@Injectable({providedIn: 'root'})
@Directive({
    selector: '[minNumber]',
    providers: [{provide: NG_VALIDATORS, useExisting: MinimumNumberValidator, multi: true}]
})
export class MinimumNumberValidator implements Validator {
    @Input() minNumber: number;

    validate(control: AbstractControl): ValidationErrors | null {
        if (+control.value < this.minNumber) {
            return {valueToSmall: true};
        }
        return null;
    }


}
