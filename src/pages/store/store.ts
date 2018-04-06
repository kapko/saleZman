import { Component, ViewChild } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { storeName } from '../../interfaces/city.store';
import { StoreService } from '../../services/store.service';
import { AppService } from '../../services/app-service';
import { MyUserService } from '../../services/my-users-service';
import { merge } from 'rxjs/operator/merge';

@Component({
  selector: 'store-page',
  templateUrl: 'store.html'
})
export class StorePage {
  @ViewChild('myTabs') tabRef: Tabs;

  store: storeName;
  products: any;
  supplyProduct: any[] = [];

  activeTabName: string = 'list-box';
  defaultCompany: string = 'All Company';
  tabs: any = [{icon: 'list-box', name: 'Stock'},{icon: 'basket', name: 'Order'},{icon: 'briefcase', name: 'Supply'},{icon: 'card', name: 'Payment'}];
  companies: any[] = [];

  constructor(
    private storeService: StoreService,
    private appService: AppService,
    private myUserService: MyUserService
  ) {
    this.getDists();

    this.appService.presentLoading(true);
    this.storeService.getStoreNameOfProduct()
      .take(1)
      .subscribe(store => {
        if (!store) return;
        this.store = store;
        this.getProducts(store.url);
      });

    this.storeService.getCompanies()
      .take(1)
      .subscribe(items => {
      });
  }

  getDists(): any {
    this.myUserService
      .getDistCompany()
      .map(data => data.reduce((a, b) => a.concat(b), []))
      .subscribe(companies => {
        this.companies = companies;
        console.log('this.companies', this.companies);
      });
  } 

  getProducts(storeNamePath: string, company: string = null): void {
    if (company === 'All Company') company = null;

    this.storeService
      .getProducts(storeNamePath, company)
      .do(() => this.appService.hideLoading())
      .take(1)
      .subscribe(products => {
        this.products = products;
      });
  }

  sortByCompany(company: string): void {
    this.getProducts(this.store.url, company);
  }

  tabSwitch(tabName: string): void {
    this.activeTabName = tabName;
    switch (tabName) {
      case 'list-box':
      case 'basket':
        this.appService.presentLoading(true);
        this.getProducts(this.store.url);
        break;
      case 'briefcase':
        break;
      default:
        this.appService.hideLoading();
    }

  }
}
