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
    this.getData(this._store['key']);
    this.checkIcons(dates);
  }

  constructor(
    private storeIconService: StoreIconService,
    private authService: AuthService,
  ) {}

  ngAfterViewInit(): void {
    this.getData(this._store['key']);
  }

  getIncludesDate(dates: string [], dataKey: string, iconKey: string): any {
    if (typeof this[dataKey] === 'string') {
      this[iconKey] = dates.includes(this[dataKey]);
    } else {
      if (this[dataKey]) {
        // check for including
        this[dataKey].map(item => {
          if (dates.includes(item)) {
            this[iconKey] = true;
            return;
          }
        });
      }
    }
  }

  checkIcons(dates: string[]): void {
    // data: strin, keyOfData: string, iconName: string
    this.getIncludesDate(dates, 'stockDate', 'showStockIcon');
    this.getIncludesDate(dates, 'orderDate', 'showOrderIcon');
    this.getIncludesDate(dates, 'supplyDate', 'showSupplyIcon');
    this.getIncludesDate(dates, 'paymentDate', 'showPaymentIcon');
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
        .getDateCountSupplyById(storeKey)
        .take(1)
        .subscribe(items => {
          this.supplyDate = (items) ? items : '';
          this.checkIcons(this._dates);
        });
      // payment
      this.storeIconService
        .getDateCountPaymentById(storeKey)
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
