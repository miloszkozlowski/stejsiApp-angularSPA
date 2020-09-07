import {Component, Input} from '@angular/core';
import {UserModel} from '../../models/user.model';
import {CommonModule} from '@angular/common';
import {UsersService} from '../../services/users.service';


@Component({
    selector: 'app-user-search-item',
    templateUrl: './user-search-item.component.html'
})
export class UserSearchItemComponent {

    @Input('user') user: UserModel;

    constructor(
        private service: UsersService
    ) {}

    onSelectedUser() {
        this.service.userSelectedSbj.next(this.user);
    }

}
