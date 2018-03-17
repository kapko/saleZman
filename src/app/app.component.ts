import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SearchPage } from '../pages/search/search';
import { AuthService } from '../services/auth.service';
import { MyWorkPage } from '../pages/my-work/my.work';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage: any;

  constructor(
    private platform: Platform, 
    private authService: AuthService,
    private menuController: MenuController,
    private statusBar: StatusBar,
    // private navController: NavController,
    private splashScreen: SplashScreen
  ) {
    this.authService.authUserId().subscribe(item => {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        // this.rootPage = MyWorkPage;
        this.rootPage = (item && item.uid) ? SearchPage : LoginPage;
      });
    });
  }

  navigate(page: any): void {
    let component;
    switch(page) {
      case 'MyWorkPage':
        component = MyWorkPage;
      break;
    }

    this.nav.setRoot(component);
    this.menuController.close();
  }

  logout(): void {
    this.authService.signOut();
    this.nav.setRoot(LoginPage);
    this.menuController.enable(false);
  }
}

