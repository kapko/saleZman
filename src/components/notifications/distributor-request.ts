import { Component, Input } from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import { AppService } from '../../services/app-service';
import { MyUserService } from '../../services/my-users-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-distributor-request',
  templateUrl: 'distributor-request.html',
})

export class DistributorRequestComponent {
  @Input() notification: any;

  constructor(
    private notificationService: NotificationService,
    private appService: AppService,
    private userService: MyUserService,
    private authService: AuthService,
  ) {}

  accept(): void {
    this.notificationService.acceptDistributorRequest(this.notification.distId)
      .then(res => {
        this.appService.showToast('You have accepted request');
        this.readNotificaion();
      })
      .catch(err => this.appService.showToast(err.message));

    this.userService.updateUserForAdmin(this.authService.currentUserId, null);
  }

  readNotificaion(): void {
    this.notificationService.readTrue(this.notification);
  }

  remove(): void {
    this.appService.showAlert('Do you want to remove this notification', [{
      text: 'yes',
      handler: e => {
        this.notificationService.removeNotification(this.notification);
      }
    }, 'no']);
    
  }
  
}
