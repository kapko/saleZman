import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../../pages/profile/profile';
import { SearchPage } from '../../pages/search/search';
import { StoreService } from '../../services/store.service';
import { Subject } from 'rxjs';
import 'rxjs';

@Component({
  selector: 'app-supply',
  templateUrl: 'supply.html',
})

export class SupplyComponent {
  @Input() products: any;
  @Input() activeTab: string;

  rowProducts: any;

  usersProduct: any[] = [];

  subject: Subject<any>;

  constructor(
    private nav: NavController,
    private appService: AppService,
    private storeService: StoreService,
  ) {
    this.subject = new Subject();
  }

  ngOnChanges(): void {
    this.rowProducts = this.products;
  }

  // getProductList(): void {
  //   this.storeService
  //     .getUserProductList()
  //     .takeUntil(this.subject)
  //     .subscribe(items => this.usersProduct = items);
  // }

  // getOrderedList(): void {
  //   this.storeService
  //     .getUserOrderedList()
  //     .takeUntil(this.subject)
  //     .subscribe(items => this.usersProduct = items);
  // }

  searchItems(ev: any): void {
    let val = (ev.target.value) ? ev.target.value : '';

    if (val && val.trim() === '') {
      this.products = this.rowProducts;
      return;
    }

    this.products = this.rowProducts.filter(item => 
      (item._name.indexOf(val.toLowerCase()) > -1)
    );
  }

  // count(product: any, count: boolean): void {
  //   if (!count && +product.counter < 1) return;
  //   product.counter += (count) ? 1 : -1;
  //   if (this.showOrdered) {
  //     this.storeService.updateUsersOrderedProductList(product);
  //   } else {
  //     this.storeService.updateUsersProductList(product);
  //   }
  // }

  // removeProduct(product: any): void {
  //   product['counter'] = 0;
  //   if (this.showOrdered) {
  //     this.storeService.updateUsersOrderedProductList(product);
  //   } else {
  //     this.storeService.updateUsersProductList(product);
  //   }
  // }

  // ngOnDestroy(): void {
  //   this.subject.next();
  //   this.subject.complete();
  // }

}
