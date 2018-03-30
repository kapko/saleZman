import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SearchPage } from '../pages/search/search';
import { AuthService } from '../services/auth.service';
import { MyWorkPage } from '../pages/my-work/my-work';
import { MyUsersPage } from '../pages/my-users/my-users';
import { AppService } from '../services/app-service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-component',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage: any;
  subject: Subject<any>;
  showAdminButton: boolean = false;
  showAdmin: boolean = false;

  constructor(
    private platform: Platform, 
    private authService: AuthService,
    private menuController: MenuController,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private appService: AppService,
  ) {
    this.subject = new Subject();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.rootPage = (this.authService.emailVerified) ? SearchPage : LoginPage;
      // this.rootPage = (item && item.uid) ? MyUsersPage : LoginPage;
    });
  }

  getUsersStatus(uid: string): void {
    this.authService
      .getProfile(uid)
      .takeUntil(this.subject)
      .subscribe(profile => {
        if (profile && profile.email === this.authService.currentUserEmail && profile.status) {
          this.showAdminButton = true;
        } else {
          this.showAdminButton = false;
        }
      });
  }

  ngOnInit(): void {
    this.authService
      .authUserId()
      .takeUntil(this.subject)
      .subscribe(user => {
        if (user) {
          this.getUsersStatus(user.uid);
        }
      });
  }

  navigate(page: any): void {
    let component;
    switch(page) {
      case 'MyWorkPage':
        component = MyWorkPage;
      break;
      case 'myUsers':
        component = MyUsersPage;
      break;
    }
    this.nav.setRoot(component);
    this.menuController.close();
  }

  logout(): void {
    localStorage.removeItem('email');
    localStorage.removeItem('uid');
    localStorage.removeItem('emailVerified');
    this.authService.signOut();
    this.nav.setRoot(LoginPage);
    this.menuController.enable(false);
    this.showAdmin = false;
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}

