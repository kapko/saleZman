import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService,
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
      .map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
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

  supplyItem(product: any): void {
    this.appService.showAlert('Please confirm to supply', [{
      text: 'ok',
      handler: () => this.updateSupplyItem(product)
    }, 'cancel'], this.store.name);
  }

  updateSupplyItem(product: any): void {
    product.supply_date = this.appService.getCurrentDate(true);
    product.supply_status = 'supplied';
    product.supplied_by = this.storeService.userId;
    // update data
    this.storeService.updateSupplyItem(this.store._name, product);
  }
}
