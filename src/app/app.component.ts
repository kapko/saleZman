import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SearchPage } from '../pages/search/search';
import { AuthService } from '../services/auth.service';
import { MyWorkPage } from '../pages/my-work/my-work';
import { MyUsersPage } from '../pages/my-users/my-users';
@Component({
  selector: 'app-component',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage: any;
  showAdmin: boolean = false;
  userProfile: Object;

  constructor(
    private platform: Platform, 
    private authService: AuthService,
    private menuController: MenuController,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.rootPage = (this.authService.currentUserId) ? SearchPage : LoginPage;
      // this.rootPage = (item && item.uid) ? MyUsersPage : LoginPage;
    });
  }

  menuOpened(): void {
    this.authService
      .getProfile(this.authService.currentUserId)
      .take(1)
      .subscribe(profile => this.userProfile = profile);
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
    this.authService.signOut();
    this.nav.setRoot(LoginPage);
    this.menuController.enable(false);
  }

}

