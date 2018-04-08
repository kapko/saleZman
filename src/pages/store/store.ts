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
    this.getDistsCompany();
    this.getProducts();
    this.appService.presentLoading(true);
    this.storeService.getStoreNameOfProduct()
      .take(1)
      .subscribe(store => {
        if (!store) return;
        this.store = store;
      });
  }

  getDistsCompany(): any {
    this.myUserService
      .getDistCompany()
      .map(data => data.reduce((a, b) => a.concat(b), []))
      .subscribe(companies => {
        this.companies = companies;
      });
  } 

  getProducts(company: string = null): void {
    if (company === 'All Company') company = null;

    this.myUserService
      .getDistProducts(company)
      .do(e => this.appService.hideLoading())
      .map(data => data.reduce((a, b) => a.concat(b), []))
      .subscribe(products => {
        this.products = products;
      });
  }

  sortByCompany(company: string): void {
    this.appService.presentLoading(true);
    this.getProducts(company);
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
