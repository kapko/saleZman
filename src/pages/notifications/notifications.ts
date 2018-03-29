
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NotificationService } from '../../services/notification-service';
import { Subject } from 'rxjs';
import { NotificationInterface } from '../../interfaces/notification-interface';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.html'
})

export class NotificationPage {
  subject: Subject<any>;

  notifications: NotificationInterface [] = [];

  constructor(
    public navCtrl: NavController,
    private notificationService: NotificationService,
  ) {
    this.subject = new Subject();

    this.notificationService.getNotifications()
      .takeUntil(this.subject)
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      .subscribe(notifications => {
        this.notifications = notifications;
      });
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
