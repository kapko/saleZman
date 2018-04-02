import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app-service';
import { AuthService } from './auth.service';
import { RequestType } from '../interfaces/notification-interface';
import { MyUserService } from './my-users-service';

@Injectable()

export class NotificationService {
  notificationPath: string = '/notifications/';

  distPath: string = this.myUserService.distributerPath;

  noteCountPath: string = '/notification-count/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private authService: AuthService,
    private myUserService: MyUserService,
  ) { }

  sendNotification(uid: string): void {
    this.db.list(this.notificationPath + uid).push({
      type: RequestType.distributor,
      create: this.appService.getCurrentDate(true),
      distId: this.authService.currentUserId
    });
  }

  getNotificationCounteById(uid: string = this.authService.currentUserId): Observable<any> {
    return this.db.object(this.noteCountPath + uid).valueChanges();
  }

  refreshNotification(uid: string = this.authService.currentUserId): Promise<any> {
    return this.db.object(this.noteCountPath + uid).set(null);
  }

  getNotifications(): Observable<any> {
    return this.db
      .list(this.notificationPath + this.authService.currentUserId)
      .snapshotChanges();
  }

  acceptDistributorRequest(distId: string): Promise<any> {
    return this.db
      .object(`${this.distPath}${distId}/${this.authService.currentUserId}/activated`)
      .set(true);
  }

  removeNotification(not: Object): Promise<any> {
    return this.db
      .object(this.notificationPath+`${this.authService.currentUserId}/${not['key']}`)
      .set(null);
  }

  readTrue(not: Object): void {
    this.db
      .object(this.notificationPath+`${this.authService.currentUserId}/${not['key']}/read`)
      .set(true);
  }

}
