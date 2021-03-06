import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../services/auth.service';
import { PersonalStorePage } from '../personal-store/personal-store';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  rootPage: any;
  data: any = {};
  toast: any;
  showReset: boolean = false;
  signup: boolean = false;

  constructor(
    private navCtrl: NavController,
    private appService: AppService,
    private authService: AuthService,
  ) { }
  
  login(): void {
    if (!Object.keys(this.data).length) {
      this.appService.showToast('Please re-enter email and password');
      return;
    }

    this.authService.signIn(this.data.email, this.data.password)
      .then(user => {
        if (user.emailVerified) {
          this.authService.getCurrentUser();
          this.appService.showToast('Success Logged in');
          this.navCtrl.setRoot(PersonalStorePage);
        } else {
          this.appService.showToast('Please verify your email');
        }
      })
      .catch(err => this.appService.showToast(err.message));
 }

  resetPassword(): void {
    if (!this.data.email) {
      this.appService.showToast('Please re-enter email');
      return;
    }
    this.authService.resetPassword(this.data.email)
      .then(res => {
        this.appService.showToast('We have sent you an email with instructions on how to reset your password.');
        this.showReset = false;
      })
      .catch(err => this.appService.showToast(err.message));
  }

  changeState(event: boolean): void {
    this.signup = event;
  }

}
