import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth.service';
import { AppService } from '../services/app-service';
// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SearchPage } from '../pages/search/search';
import { CityService } from '../services/city.service';

let fireBaseConfig = {
  apiKey: "AIzaSyA2aEZm0QjHcfEDNidxMTS3L0TByeQHpDw",
  authDomain: "salezman-9e9ea.firebaseapp.com",
  databaseURL: "https://salezman-9e9ea.firebaseio.com",
  projectId: "salezman-9e9ea",
  storageBucket: "salezman-9e9ea.appspot.com",
  messagingSenderId: "681442854297"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SearchPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(fireBaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SearchPage    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    CityService,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
