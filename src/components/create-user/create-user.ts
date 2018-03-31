import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app-service';
import { MyUserService } from '../../services/my-users-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-create-user',
  templateUrl: 'create-user.html'
})

export class CreateUserComponent {

  constructor(
    public viewCtrl: ViewController,
    private authService: AuthService,
    private appService: AppService,
    private myUserService: MyUserService,
    private notificationService: NotificationService,
  ) { }

  createNewUser(email: string): any {
    if (!email) return;
    if (email === this.authService.currentUserEmail) {
      this.appService.showToast("You can't link self account!");
      return;
    }

    // check for email in db
    this.myUserService.getUserByEmail(email)
      .take(1)
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      .subscribe(user => {
        if (!user.length) {
          this.appService.showToast("Can't find this user in system.");
          return;
        }
        // check user for available
        switch(user[0].status) {
          case 'user':
          case undefined:
            this.linkEmail(user[0].key);
            break;
          case 'distributor':
            this.appService.showToast('This user is distributor');
            break;
        }

      });
  }

  linkEmail(uid): void {
    this.myUserService.getDistributorUserByEmail(uid)
      .take(1)
      .subscribe(user => {
        if (user) {
          this.appService.showToast('This user already in you list');
          return;
        }
        this.myUserService.createUserForDistributor(uid);
        this.notificationService.sendNotification(uid);
        this.cancel();
        this.appService.showToast('This user will get notification for review');
      });
  }

  cancel(): void {
    this.viewCtrl.dismiss();
  }

}
