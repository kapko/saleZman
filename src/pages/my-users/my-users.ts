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
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      .subscribe(users => {
        this.users = users;
      });
  }

  activateUser(user: Object): void {
    if (!user['activated']) {
      this.appService.showToast("User not activated yet!");
      return;
    }

    this.authService.updateDistributorsUser(user['key'], (user['status']) ? false : true);
  }

  createNewUser(): void {
    this.authService
      .getProfile(this.authService.currentUserId)
      .take(1)
      .subscribe(profile => {
        // if status just user can't create more then 1 salezman
        if (profile.status === 'user') {
          if (this.users.length >= 1) {
            this.appService.showToast("You don't have permissions create more then 1 salezman");
          } else {
            this.getModal();
          }
        } else {
          this.getModal();
        }
      });
  }

  getModal(): void {
    let contactModal = this.modalController.create(CreateUserComponent);
    contactModal.present();
  }

  deleteUser(user: Object): void {
    this.appService.showToast('will be remove user from DB');
    console.log('user', user);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
