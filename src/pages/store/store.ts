import { Component, ViewChild } from '@angular/core';
import { NavParams, Tabs } from 'ionic-angular';
import { storeName } from '../../interfaces/city.store';
import { StoreService } from '../../services/store.service';
import { AppService } from '../../services/app-service';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'store-page',
  templateUrl: 'store.html'
})
export class StorePage {
  @ViewChild('myTabs') tabRef: Tabs;

  store: storeName;
  products: any;
  activeTabName: string = 'list-box';
  tabs: any = ['list-box', 'basket', 'briefcase', 'card'];
  companies: Observable<any>;

  constructor(
    private navParams: NavParams,
    private storeService: StoreService,
    private appService: AppService,
  ) {
    this.appService.presentLoading(true);
    this.storeService.getStoreNameOfProduct()
      .do(() => this.appService.hideLoading())
      .take(1)
      .subscribe(store => {
        this.store = store;
        this.getProducts(store.url);
      });

    this.companies = this.storeService.getCompanies().take(1);
  }

  getProducts(storeNamePath: string, company: string = null): void {
    this.storeService
      .getProducts(storeNamePath, company)
      .take(1)
      .subscribe(products => this.products = products);
  }


  sortByCompany(company: string): void {
    this.getProducts(this.store.url, company);
  }

  tabSwitch(tabName: string): void {
    this.activeTabName = tabName;
  }
}
