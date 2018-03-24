import { Component } from '@angular/core';
import { AppService } from '../services/app-service';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-icon menuToggle class="white icon" name="menu" float-left></ion-icon>
      <ion-icon 
        (click)="moveToHome()"
        class="white icon" name="home" float-right></ion-icon>
      <ion-icon class="white icon" name="contact" float-right></ion-icon>
      <span class="white email" float-right>{{userEmail}}</span>
      <span class="white" float-right>{{date}}</span>
    </ion-navbar>
  </ion-header>`,
  styles: [`
  .white {color: white; padding: 0 10px; font-size: 18px} 
  .icon {font-size: 29px; padding-top: 3px;} 
  .bar-buttons-md {-webkit-order: 0; order: 0;} 
  .email {font-size: 14px; text-decoration: underline;}`]
})

export class HeaderComponent {
  date: string;
  userEmail: string;
  userId: Observable<any>;

  constructor(
    private nav: NavController,
    private appService: AppService,
    private authService: AuthService,
  ) {
    this.date = this.appService.getCurrentDate();
    this.getEmail();
  }

  moveToHome(): void {
    this.nav.setRoot(SearchPage);
  }

  getEmail(): any {
    this.authService.authUserId()
      .take(1)
      .subscribe(item => {
        this.authService.getProfile(item.uid)
          .take(1)
          .subscribe(user => {
            this.userEmail = user.email;
          });
      });
  }

  moveToProfile(): void {
    let componentName = this.nav.getActive().name;
    if (componentName === 'ProfilePage') return;

    this.nav.push(ProfilePage);
  }
}
