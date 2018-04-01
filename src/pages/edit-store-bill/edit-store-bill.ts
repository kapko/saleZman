import { Component } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NavParams } from 'ionic-angular';
import { MyUserService } from '../../services/my-users-service';
import { Observable } from '@firebase/util';

@Component({
  selector: 'app-edit-store-bill',
  templateUrl: 'edit-store-bill.html',
})

export class EditBillStorePage {
  product: any;

  orderedItems: any [] = [];

  subject: Subject<any>;

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private authService: AuthService,
    private navParams: NavParams,
    private myService: MyUserService,
  ) {
    this.subject = new Subject();
    this.product = this.navParams.data;
    this.orderedItems = this.getStoreOrderedItem(this.product);
  }

  getStoreOrderedItem(product: any): any[] {
    let orderedItems = [];
    for (let key of product.orderedKeys) {
      orderedItems.push(this.myService.getStoreOrderedItem(key).take(1));
    }
    return orderedItems;
  }

  updateProduct(product: any): void {
    let date = '';
    let key = `${product.order_id}-${product.ordered_by}`;
    // check date for updates
    if (product.bill_date.split('-')[0].length > 3) {
      for (let i = 2; i >= 0; i--) {
        let item = product.bill_date.split('-')[i];
        date += (i === 2) ? item : '-' + item;
      }
    } else {
      date = product.bill_date;
    }

    product.bill_date = date;
    product.edit = false;
    // update value of product
    // this.storeService.addTestSupply(product, key)
    //   .then(res => this.appService.showToast('Updated'))
    //   .catch(err => this.appService.showToast(err.message));
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
