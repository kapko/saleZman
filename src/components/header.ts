import { Component } from '@angular/core';
import { AppService } from '../services/app-service';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { AuthService } from '../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { NotificationPage } from '../pages/notifications/notifications';
import { NotificationService } from '../services/notification-service';

@Component({
  selector: 'app-header',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-icon menuToggle class="white icon" name="menu" float-left></ion-icon>
      <ion-icon 
        (click)="moveToHome()"
        class="white icon" name="home" float-right></ion-icon>
      <ion-icon 
        (click)="moveToNotifications()" 
        [ngClass]="{'active-count': this.notificationCounter}"
        class="white icon" 
        name="notifications" 
        float-right></ion-icon>
      <div class="date-email">
        <span class="white email" float-right>{{userEmail}}</span>
        <span class="white" float-right>{{date}}</span>
      </div>
    </ion-navbar>
  </ion-header>`,
  styles: [`
  .white {color: white; padding: 0 10px; font-size: 18px} 
  .icon {font-size: 24px; padding: 3px 3px 0 3px;} 
  .bar-buttons-md {-webkit-order: 0; order: 0;} 
  .active-count {color: #fff38d;}
  .email {font-size: 14px; text-decoration: underline;}
  .date-email {width: 60%; float: right;}
  `]
})

export class HeaderComponent {
  date: string;
  userEmail: string;
  notificationCounter: number | null;
  userId: Observable<any>;
  subject: Subject<any>;

  constructor(
    private nav: NavController,
    private appService: AppService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.subject = new Subject();
    this.date = this.appService.getCurrentDate();
    this.getEmail();

    this.notificationService
      .getNotificationCounteById()
      .takeUntil(this.subject)
      .subscribe(count => this.notificationCounter = count);
  }

  moveToHome(): void {
    this.nav.setRoot(SearchPage);
  }

  getEmail(): any {
    this.userEmail = this.authService.currentUserEmail;
  }

  moveToNotifications(): void {
    if (this.nav.getActive().name === 'NotificationPage') return;
    // NotificationPage
    this.nav.push(NotificationPage);
    this.notificationService.refreshNotification();
  }

  moveToProfile(): void {
    let componentName = this.nav.getActive().name;
    if (componentName === 'ProfilePage') return;

    this.nav.push(ProfilePage);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
