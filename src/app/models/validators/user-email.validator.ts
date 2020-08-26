import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable, timer} from 'rxjs';
import {Directive, Injectable} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
@Directive({
    selector: '[emailAvaliable]',
    providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UserEmailValidator, multi: true}]
})
export class UserEmailValidator implements AsyncValidator {
    constructor(private userService: UsersService) {
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return timer(400).pipe(
            switchMap(() => {
                    return this.userService.checkEmailAvailability(control.value);
                }
            )
        );
    }

}
