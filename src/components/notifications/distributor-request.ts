import { Component, Input } from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'app-distributor-request',
  templateUrl: 'distributor-request.html',
})

export class DistributorRequestComponent {
  @Input() notification: any;

  constructor(
    private notificationService: NotificationService,
    private appService: AppService,
  ) {}

  accept(): void {
    this.notificationService.acceptDistributorRequest(this.notification.distId)
      .then(res => {
        this.appService.showToast('You have accepted request');
        this.readNotificaion();
      })
      .catch(err => this.appService.showToast(err.message))
  }

  readNotificaion(): void {
    this.notificationService.readTrue(this.notification);
  }

  remove(): void {
    this.notificationService.removeNotification(this.notification);
  }
  
}
