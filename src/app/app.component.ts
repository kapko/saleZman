import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SearchPage } from '../pages/search/search';
import { AuthService } from '../services/auth.service';
import { StorePage } from '../pages/store/store';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage: any;

  constructor(
    platform: Platform, 
    private authService: AuthService,
    private menuController: MenuController,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    let uid;
    this.authService.authUserId().subscribe(item => uid = (item) ? item.uid : null);
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      if (!uid) {
        this.rootPage = LoginPage;
      } else {
        this.rootPage = SearchPage;
        // this.rootPage = StorePage;
      }
    });
  }

  logout(): void {
    this.authService.signOut();
    this.nav.setRoot(LoginPage);
    this.menuController.enable(false);
  }
}

