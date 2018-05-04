import { Component, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'store-billing-payment',
  templateUrl: 'store-billing-payment.html'
})

export class StoreBillingPayment {
  supplyItems: any[] = [];

  @Input()
  set key(key: string) {
    this.getStorePayments(key);
  }

  constructor(private storeService: StoreService) {}

  getStorePayments(key: string): void {
    this.storeService.getSupplyByKey(key)
      .take(1)
      .subscribe(supplyItems => {
        this.supplyItems = supplyItems;
      });
  }

}
