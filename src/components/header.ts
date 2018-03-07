import { Component } from '@angular/core';
import { AppService } from '../services/app-service';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';

@Component({
  selector: 'app-header',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-icon menuToggle class="white icon" name="menu" float-left></ion-icon>
      <ion-icon class="white icon" name="contact" float-right></ion-icon>
      <ion-icon 
        (click)="moveToHome()"
        class="white icon" name="home" float-right></ion-icon>
      <span class="white" float-right>{{date}}</span>
    </ion-navbar>
  </ion-header>`,
  styles: [`.white {color: white; padding: 0 10px; font-size: 18px} .icon {font-size: 21px} .bar-buttons-md {-webkit-order: 0; order: 0;}`]
})

export class HeaderComponent {
  date: string;

  constructor(
    private nav: NavController,
    private appService: AppService,
  ) {
    this.date = this.appService.getCurrentDate();
  }

  moveToHome(): void {
    this.nav.setRoot(SearchPage);
  }

  moveToProfile(): void {
    let componentName = this.nav.getActive().name;
    if (componentName === 'ProfilePage') return;

    this.nav.push(ProfilePage);
  }
}
