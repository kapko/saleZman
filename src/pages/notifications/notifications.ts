
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.html'
})

export class NotificationPage {

  constructor(public navCtrl: NavController) {
    console.log('notifications');
  }

}
