import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable, timer} from 'rxjs';
import {Directive, Injectable} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
@Directive({
    selector: '[phoneNumberAvaliable]',
    providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UserPhoneNumberValidator, multi: true}]
})
export class UserPhoneNumberValidator implements AsyncValidator {
    constructor(private userService: UsersService) {
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return timer(400).pipe(
            switchMap(() => {
                    return this.userService.checkPhoneNumberAvailability(control.value);
                }
            )
        );
    }

}
