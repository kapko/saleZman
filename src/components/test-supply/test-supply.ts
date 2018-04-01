import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-test-supply',
  templateUrl: 'test-supply.html',
})

export class SupplyTestComponent {
  @Input() salezman: string;
  @Input() chooseDate: string [];
 
  products: any[] = [];

  subject: Subject<any>;

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private authService: AuthService,
  ) {
    this.subject = new Subject();
  }

  ngOnChanges(): void {
    if (this.salezman) {
      this.salezman = (this.salezman === 'All') ? null : this.salezman;
    }

    this.getTestSupply();
  }

  getTestSupply(): void {
    this.storeService.getTestSupply(this.salezman)
      .takeUntil(this.subject)
      .map(data => data.filter(el => this.chooseDate.includes(el['order_date'])))
      .subscribe(products => {
        this.products = products;
      });
  }

  approveItem(): void {
    this.appService.showToast('approve this item');
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
    this.storeService.addTestSupply(product, key)
      .then(res => this.appService.showToast('Updated'))
      .catch(err => this.appService.showToast(err.message));
  }

  deleteItem(product: any): void {
    let key = `${product.order_id}-${product.ordered_by}`;
    // REMOVE    
    this.appService.showAlert('Do you want to remove this product?', [{
      text: 'yes',
      handler: e => {
        this.storeService.addTestSupply(null, key)
          .then(res => this.appService.showToast('Deleted'))
          .catch(err => this.appService.showToast(err.message));
      }
    }, 'no']);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
