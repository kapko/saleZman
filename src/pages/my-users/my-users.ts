import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { CreateUserComponent } from '../../components/create-user/create-user';
import { MyUserService } from '../../services/my-users-service';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-my-users',
  templateUrl: 'my-users.html'
})

export class MyUsersPage {
  subject: Subject<any>;

  users: any[] = [];

  constructor(
    private modalController: ModalController,
    private myUserService: MyUserService,
    private appService: AppService,
    private authService: AuthService,
  ) {
    this.subject = new Subject();

    this.myUserService.getMyUsers()
      .takeUntil(this.subject)
      .map(data => this.appService.getKeys(data))
      .subscribe(users => {
        this.users = users;
      });
  }

  activateUser(user: Object, status: boolean = false): void {
    this.authService.updateDistributorsUser(user['key'], status);
    this.authService.updateUserForAdmin(user['key'], (status) ? 'user' : null);
  }

  createNewUser(): void {
    let contactModal = this.modalController.create(CreateUserComponent);
    contactModal.present();
  }

  deleteUser(user: Object): void {
    console.log('user', user);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
