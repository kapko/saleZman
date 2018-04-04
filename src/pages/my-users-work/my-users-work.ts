import { Component } from '@angular/core';
import { MyUserService } from '../../services/my-users-service';

@Component({
  selector: 'app-my-users-work',
  templateUrl: 'my-users-work.html',
})

export class MyUsersWorkPage {

  user: string = 'All';

  date: string = 'Today';

  users: any[] = [];

  options: string[] = ['stock', 'order', 'supply', 'payment'];

  days: string[] = ['Today', 'Yesterday', 'This week', 'This month'];

  constructor(
    private myUserService: MyUserService,
  ) {
    this.getMyUsers();
  }

  optionsUpdate(options: any[string]): void {
    this.options = options;
  }

  getMyUsers(): void {
    this.myUserService.getMyUsers()
      .take(1)
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      .subscribe(users => {
        this.users = users;
      })
  }

}
