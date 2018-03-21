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
// pipes
import { GetEmailPipe } from '../pipe/get-email';
// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
// pages
import { SearchPage } from '../pages/search/search';
import { CityService } from '../services/city.service';
import { ProfilePage } from '../pages/profile/profile';
// components
import { HeaderComponent } from '../components/header';
import { FooterComponent } from '../components/footer';
import { StorePage } from '../pages/store/store';
import { StoreService } from '../services/store.service';
import { ListComponent } from '../components/list/list';
import { SupplyComponent } from '../components/supply/supply';
import { PaymentComponent } from '../components/payment/payment';
import { ChqComponent } from '../components/payment/cheque/cheque';
import { NeftComponent } from '../components/payment/neft/neft';
import { CashComponent } from '../components/payment/cash/cash';
import { PaidListComponent } from '../components/payment/paidlist/paid';
import { MyWorkPage } from '../pages/my-work/my-work';
import { MyService } from '../services/my-service';
import { MyWorkedListComponent } from '../components/my-worked-list/my-worked-list';
import { KeysPipe } from '../pipe/keys';
import { DatePipe } from '../pipe/dateFilter';
import { GetShopNumberPipe } from '../pipe/getTotalShops';

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
    ProfilePage,
    HeaderComponent,
    StorePage,
    FooterComponent,
    ListComponent,
    SupplyComponent,
    GetEmailPipe,
    PaymentComponent,
    ChqComponent,
    NeftComponent,
    CashComponent,
    PaidListComponent,
    MyWorkPage,
    MyWorkedListComponent,
    KeysPipe,
    DatePipe,
    GetShopNumberPipe,
  ],
  imports: [
    BrowserModule,
    // IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp,{
      menuType: 'push',
      platforms: {
        ios: {
          menuType: 'overlay',
        }
      }
    }),
    AngularFireModule.initializeApp(fireBaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SearchPage,
    ProfilePage,
    StorePage,
    HeaderComponent,
    FooterComponent,
    ListComponent,
    SupplyComponent,
    PaymentComponent,
    ChqComponent,
    NeftComponent,
    CashComponent,
    PaidListComponent,
    MyWorkPage,
    MyWorkedListComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    StoreService,
    CityService,
    AuthService,
    MyService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
