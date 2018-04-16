import { Component, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'store-icons',
  templateUrl: 'store-icons.html',
})

export class StoreIconComponent {
  stockDate: string;

  orderDate: string;

  supplyDate: string;

  paymentDate: string;

  showStockIcon: boolean = false;

  showOrderIcon: boolean = false;

  showSupplyIcon: boolean = false;

  showPaymentIcon: boolean = false;

  @Input()
  set dates(dates: string[]) {
    this.showStockIcon = dates.includes(this.stockDate);
    this.showOrderIcon = dates.includes(this.orderDate);
    this.showSupplyIcon = dates.includes(this.supplyDate);
    this.showPaymentIcon = dates.includes(this.paymentDate);
  }

  @Input()
  set store(item: Object) {
    this.getData(item['key']);
  }

  constructor(private storeService: StoreService) {}

  getData(storeKey: string) {
    let key = storeKey.toLocaleLowerCase();

    this.storeService.getStockCountDate(key)
      .take(1)
      .subscribe(date => {
        this.stockDate = date;
      });

    this.storeService.getOrderCountDate(key)
      .take(1)
      .subscribe(date => {
        this.orderDate = date;
      });

    this.storeService.getSupplyCountDate(key)
      .take(1)
      .subscribe(date => {
        this.supplyDate = date;
      });

    this.storeService.getPaymentCountDate(key)
      .take(1)
      .subscribe(date => {
        this.paymentDate = date;
      });
  }

}
