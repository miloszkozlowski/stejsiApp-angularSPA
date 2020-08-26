import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserWriteModel} from '../models/user-write.model';
import {UsersService} from '../services/users.service';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {
    isPosting: boolean = false;
    hasErrorOccurred: boolean = false;
    occurredErrorMessage: string;
    constructor(private userService: UsersService) {
    }
    onSubmit(newUserForm: NgForm): void {
        this.isPosting = true;
        console.log(newUserForm);
        const userWriteModel = new UserWriteModel(
            newUserForm.form.value.name,
            newUserForm.form.value.surname,
            newUserForm.form.value.email,
            newUserForm.form.value.phoneNumber
        );
        this.userService.registerUser(userWriteModel).subscribe(addedUser => {
            newUserForm.reset();
            this.isPosting = false;
        }, error => {
            this.hasErrorOccurred = true;
            this.occurredErrorMessage = error;
            this.isPosting = false;
        });
    }
}
