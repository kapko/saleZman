import { Component, Input } from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import { AppService } from '../../services/app-service';
import { MyUserService } from '../../services/my-users-service';
import { NotificationInterface } from '../../interfaces/notification-interface';

@Component({
  selector: 'app-distributor-request',
  templateUrl: 'distributor-request.html',
})

export class DistributorRequestComponent {
  @Input() notification: NotificationInterface;

  constructor(
    private notificationService: NotificationService,
    private appService: AppService,
    private myService: MyUserService,
  ) {}

  accept(): void {
    // update notification if accepted
    this.notificationService.acceptDistributorRequest(this.notification.distId)
      .then(res => {
        this.appService.showToast('You have accepted request');
        this.readNotificaion();
      })
      .catch(err => this.appService.showToast(err.message));

    // link this user for dist.
    this.myService.linkUser(this.notification.distId)
      .then(res => {
        this.appService.showToast('You account linked to this distributor');
      })
      .catch(err => this.appService.showToast(err.message));
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
