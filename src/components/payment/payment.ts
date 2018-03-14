import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.html',
})

export class PaymentComponent {
  @Input() store: storeName;

  billArray: any = ['Last 5 bills', 'Last 10 bills', 'Last 15 bills', 'All'];

  rowProducts: any[] = [];

  products: any[] = [];

  commits: any[] = [];

  billValue: string = 'Last 5 bills';

  subject: Subject<any>;

  comment: string = '';

  constructor(
    private appService: AppService,
    private storeService: StoreService,
  ) {
    this.subject = new Subject();
    this.appService.presentLoading(true);
  }

  ngOnChanges(): void {
    if (!this.store) return;
    this.getComments();
    this.getPaymentList(this.store._name, 5);
  }

  getPaymentList(storeName: string, limit: number = null): void {
    this.storeService
      .getPaymentList(storeName, limit)
      .do(() => this.appService.hideLoading())
      .take(1)
      .map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      .subscribe(supplies => {
        this.products = supplies;
        this.rowProducts = supplies;
      });
  }

  payEvent(product: Object): void {
    console.log(product);
    product['payOptions'] = true;
    
  }

  sortByBill(value: string): void {
    let limit;
    switch (value) {
      case 'Last 5 bills':
        limit = 5;
        break;
      case 'Last 10 bills':
        limit = 10;
        break;
      case 'Last 15 bills':
        limit = 15;
        break;
      default:
        limit = null;
    }

    this.getPaymentList(this.store._name, limit);
  }

  // supplyItem(product: any): void {
  //   this.appService.showAlert('Please confirm to supply', [{
  //     text: 'ok',
  //     handler: () => this.updateSupplyItem(product)
  //   }, 'cancel'], this.store.name);
  // }

  // updateSupplyItem(product: any): void {
  //   product.supply_date = this.appService.getCurrentDate(true);
  //   product.supply_status = 'supplied';
  //   product.supplied_by = this.storeService.userId;
  //   // update data
  //   this.storeService.updateSupplyItem(this.store._name, product);
  // }

  getComments(): void {
    this.storeService
      .getCommonCommit(this.store._name, true)
      .takeUntil(this.subject)
      .subscribe(messages => this.commits = messages)
  }

  submitCommit(event: any): void {
    let value = event.target.value;
    let data = {};
    data['uid'] = this.storeService.userId;
    data['message'] = value;
    data['date'] = this.appService.getCurrentDate(true);
    // update data
    this.storeService.submitCommonCommit(data, this.store._name);
    this.comment = '';
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
