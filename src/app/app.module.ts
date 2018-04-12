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
import { MyUserService } from '../services/my-users-service';
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
import { SignupPage } from '../pages/signup/signup';
import { MyUsersPage } from '../pages/my-users/my-users';
import { StoreBillingPage } from '../pages/store-billing/store-billing';

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
import { GetShopNumberPipe } from '../pipe/getTotalShops';
import { CreateUserComponent } from '../components/create-user/create-user';
import { NotificationPage } from '../pages/notifications/notifications';
import { NotificationService } from '../services/notification-service';
import { DistributorRequestComponent } from '../components/notifications/distributor-request';
import { SupplyTestComponent } from '../components/test-supply/test-supply';
import { StoreCommentComponent } from '../components/store-comment/store-comment';
import { EditBillStorePage } from '../pages/edit-store-bill/edit-store-bill';
import { MyUsersWorkPage } from '../pages/my-users-work/my-users-work';
import { MyUsersWorkedListComponent } from '../components/my-users-work-list/my-users-work-list';
import { CountDirective } from '../directives/get-count';
import { MyListHeadComponent } from '../components/my-list-head/my-list-head';
import { MyUserListCardComponent } from '../components/my-user-list-card/my-user-list-card';
import { ManageProductPage } from '../pages/manage-products/manage-products';
import { ManageStorePage } from '../pages/manage-store/manage-store';
import { AddCompanyComponent } from '../components/add-company/add-company';
import { AddProductComponent } from '../components/add-product/add-product';
import { ManageProductListCompany } from '../components/manage-product-list/manage-product-list';
import { DemicalPipe } from '../pipe/demical';
import { SearchListComponent } from '../components/search-list/search-list';
import { SearchItemComponent } from '../components/search-item/search-item';
import { PersonalStorePage } from '../pages/personal-store/personal-store';
import { CreateStoreComponent } from '../components/create-store/create-store';

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
    GetShopNumberPipe,
    SignupPage,
    MyUsersPage,
    CreateUserComponent,
    NotificationPage,
    DistributorRequestComponent,
    StoreBillingPage,
    SupplyTestComponent,
    StoreCommentComponent,
    EditBillStorePage,
    MyUsersWorkPage,
    MyUsersWorkedListComponent,
    CountDirective,
    MyListHeadComponent,
    MyUserListCardComponent,
    ManageProductPage,
    ManageStorePage,
    DemicalPipe,
    AddCompanyComponent,
    AddProductComponent,
    ManageProductListCompany,
    SearchListComponent,
    SearchItemComponent,
    PersonalStorePage,
    CreateStoreComponent
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
    SignupPage,
    MyUsersPage,
    CreateUserComponent,
    NotificationPage,
    DistributorRequestComponent,
    StoreBillingPage,
    SupplyTestComponent,
    StoreCommentComponent,
    EditBillStorePage,
    MyUsersWorkPage,
    MyUsersWorkedListComponent,
    MyListHeadComponent,
    MyUserListCardComponent,
    ManageProductPage,
    ManageStorePage,
    AddCompanyComponent,
    AddProductComponent,
    ManageProductListCompany,
    SearchListComponent,
    SearchItemComponent,
    PersonalStorePage,
    CreateStoreComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    StoreService,
    CityService,
    AuthService,
    MyService,
    MyUserService,
    NotificationService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
