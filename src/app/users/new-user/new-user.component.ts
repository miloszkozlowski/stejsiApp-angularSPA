import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserWriteModel} from '../../models/user-write.model';
import {UsersService} from '../../services/users.service';
import {UserModel} from '../../models/user.model';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {
    isPosting: boolean = false;
    hasErrorOccurred: boolean = false;
    errorMessage: string;
    infoMessage: string;
    addedUser: UserModel;

    constructor(private userService: UsersService) {
    }
    onSubmit(newUserForm: NgForm): void {
        this.addedUser = null;
        this.isPosting = true;
        const userWriteModel = new UserWriteModel(
            newUserForm.form.value.name,
            newUserForm.form.value.surname,
            newUserForm.form.value.email,
            newUserForm.form.value.phoneNumber
        );
        this.userService.registerUser(userWriteModel).subscribe(addedUser => {
            this.addedUser = addedUser;
            newUserForm.reset();
            this.infoMessage = addedUser.name + ' ' + addedUser.surname + ' - Twój nowy podopieczny został dodany. ';
            this.isPosting = false;
        }, error => {
            this.hasErrorOccurred = true;
            this.errorMessage = error;
            this.isPosting = false;
        });
    }
}
