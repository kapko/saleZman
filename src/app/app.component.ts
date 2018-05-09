import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth.service';
import { MyWorkPage } from '../pages/my-work/my-work';
import { MyUsersPage } from '../pages/my-users/my-users';
import { Subject } from 'rxjs';
import { StoreBillingPage } from '../pages/store-billing/store-billing';
import { MyUsersWorkPage } from '../pages/my-users-work/my-users-work';
import { ManageProductPage } from '../pages/manage-products/manage-products';
import { PersonalStorePage } from '../pages/personal-store/personal-store';
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
  ) {
    this.subject = new Subject();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  getUsersStatus(uid: string): void {
    this.authService
      .getProfile(uid)
      // .takeUntil(this.subject)
      .take(1)
      .subscribe(profile => {
        if (profile && profile.email === this.authService.currentUserEmail) {
          if (profile.status) {
            this.showAdminButton = true;
            this.authService.currentUserStatus = profile.status;
          } else {
            this.showAdminButton = false;
            this.authService.currentUserStatus = null;
          }
        }

        this.rootPage = (this.authService.emailVerified) ? PersonalStorePage : LoginPage;
      });
  }

  ngAfterViewInit(): void {
    this.authService
      .authUserId()
      .takeUntil(this.subject)
      .subscribe(user => {
        if (user) {
          this.getUsersStatus(user.uid);
        } else {
          this.rootPage = (this.authService.emailVerified) ? PersonalStorePage : LoginPage;
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
      case 'storeBilling':
        component = StoreBillingPage;
      break;
      case 'myUsersWork':
        component = MyUsersWorkPage;
      break;
      case 'manageProduct':
        component = ManageProductPage;
      break;
      case 'manageStore':
        // component = ManageStorePage;
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

