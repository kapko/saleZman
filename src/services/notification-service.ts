import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app-service';
import { AuthService } from './auth.service';
import { NotificationType, RequestType } from '../interfaces/notification-interface';

@Injectable()

export class NotificationService {
  notificationPath: string = '/notifications/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private authService: AuthService,
  ) { }

  sendNotification(uid: string): void {
    this.db.list(this.notificationPath + uid).push({
      type: RequestType.distributor,
      create: this.appService.getCurrentDate(true),
      distId: this.authService.currentUserId
    });
  }

}
