import { Component, Input } from '@angular/core';
import { StoreIconService } from '../../services/store-icon-serice';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'store-icons',
  templateUrl: 'store-icons.html',
})

export class StoreIconComponent {
  stockDate: string | string[];

  orderDate: string | string[];

  supplyDate: string | string[];

  paymentDate: string | string[];

  showStockIcon: boolean = false;

  showOrderIcon: boolean = false;

  showSupplyIcon: boolean = false;

  showPaymentIcon: boolean = false;

  _store: Object;

  _dates: string[];

  @Input()
  set store(store: Object) {
    this._store = store;
  }

  @Input()
  set dates(dates: string[]) {
    this._dates = dates;
    this.checkIcons(dates);
  }

  constructor(
    private storeIconService: StoreIconService,
    private authService: AuthService,
  ) {}

  ngAfterViewInit(): void {
    this.getData(this._store['key']);
  }

  checkIcons(dates: string[]): void {
    if (typeof this.stockDate === 'string') {
      this.showStockIcon = dates.includes(this.stockDate);
    } else {
      if (this.stockDate) {
        this.stockDate.map(item => {
          this.showStockIcon = dates.includes(item);
        });
      }
    }

    if (typeof this.orderDate === 'string') {
      this.showOrderIcon = dates.includes(this.orderDate);
    } else {
      if (this.orderDate) {
        this.orderDate.map(item => {
          this.showOrderIcon = dates.includes(item);
        });
      }
    }

    if (typeof this.supplyDate === 'string') {
      this.showSupplyIcon = dates.includes(this.supplyDate);
    } else {
      if (this.supplyDate) {
        this.supplyDate.map(item => {
          this.showSupplyIcon = dates.includes(item);
        });
      }
    }

    if (typeof this.paymentDate === 'string') {
      this.showPaymentIcon = dates.includes(this.paymentDate);
    } else {
      if (this.paymentDate) {
        this.paymentDate.map(item => {
          this.showPaymentIcon = dates.includes(item);
        });
      }
    }
  }

  getData(storeKey: string) {
    // if it's just a user not a distributor
    if (!this.authService.currentUserStatus) {
      this.storeIconService
        .getDateCountStockById(storeKey)
        .take(1)
        .subscribe(items => {
          this.stockDate = (items) ? items : '';
          this.checkIcons(this._dates);
        });
      // order
      this.storeIconService
        .getDateCountOrderById(storeKey)
        .take(1)
        .subscribe(items => {
          this.orderDate = (items) ? items : '';
          this.checkIcons(this._dates);
        });
      // supply
      this.storeIconService
        .getDateCountOrderById(storeKey)
        .take(1)
        .subscribe(items => {
          this.supplyDate = (items) ? items : '';
          this.checkIcons(this._dates);
        });
      // payment
      this.storeIconService
        .getDateCountOrderById(storeKey)
        .take(1)
        .subscribe(items => {
          this.paymentDate = (items) ? items : '';
          this.checkIcons(this._dates);
        });

    } else {
      // stock
      this.storeIconService
        .getCountDateForDistributor(storeKey, 'stock')
        .subscribe(res => {
          this.stockDate = res;
          this.checkIcons(this._dates);
        });
      // order
      this.storeIconService
        .getCountDateForDistributor(storeKey, 'order')
        .subscribe(res => {
          this.orderDate = res;
          this.checkIcons(this._dates);
        });
      // supply
      this.storeIconService
        .getCountDateForDistributor(storeKey, 'supply')
        .subscribe(res => {
          this.supplyDate = res;
          this.checkIcons(this._dates);
        });
      // payment
      this.storeIconService
        .getCountDateForDistributor(storeKey, 'payment')
        .subscribe(res => {
          this.paymentDate = res;
          this.checkIcons(this._dates);
        });
    }

  }

}
