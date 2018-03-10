import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';

@Component({
  selector: 'app-supply',
  templateUrl: 'supply.html',
})

export class SupplyComponent {
  @Input() store: storeName;

  billArray: any = ['Last 5 bills', 'Last 10 bills', 'Last 15 bills', 'All'];

  rowProducts: any[] = [];

  products: any[] = [];

  constructor(
    private appService: AppService,
    private storeService: StoreService,
  ) {
    this.appService.presentLoading(true);
  }

  ngOnChanges(): void {
    if (!this.store) return;
    this.getSupplyList(this.store._name);
  }

  getSupplyList(storeName: string, limit: number = null): void {
    this.storeService
      .getSupplyList(storeName, limit)
      .do(() => this.appService.hideLoading())
      .take(1)
      .subscribe(supplies => {
        this.products = supplies;
        this.rowProducts = supplies;
      });
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

    this.getSupplyList(this.store._name, limit);
  }

}
