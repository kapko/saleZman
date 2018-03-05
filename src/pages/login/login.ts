import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  rootPage: any;
  data: any = {};
  toast: any;

  userSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private appService: AppService,
    private authService: AuthService
  ) {}

 login(): void {
    if (!Object.keys(this.data).length) {
      this.appService.showToast('Please re-enter email and password');
      return;
    }

    this.userSubscription = this.authService.signIn(
      this.data.email, this.data.password)
    .then(item => {
      localStorage.setItem('auth', item);
      this.appService.showToast('Success');
      this.navCtrl.setRoot(HomePage);
    })
    .catch(err => this.appService.showToast(err.message));
 }

}
