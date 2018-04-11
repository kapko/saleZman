import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MyUserService } from '../../services/my-users-service';

@Component({
  selector: 'app-supply',
  templateUrl: 'supply.html',
})

export class SupplyComponent {
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
    private authService: AuthService,
    private myUserService: MyUserService
  ) {
    this.subject = new Subject();
    this.appService.presentLoading(true);
  }

  ngOnChanges(): void {
    if (!this.store) return;
    this.getProductsForSupply();
    this.getComments();
  }

  getProductsForSupply(limit: number = 5): void {
    let status = this.authService.currentUserStatus;
    if (!status) {
      this.getSupplyList(limit);
    } else {
      this.getSupplyForDist(limit);
    }
  }

  getSupplyList(limit: number = 5): void {
    this.myUserService
      .getDistSupply(this.store._name)
      .map(data => data.reduce((a, b) => a.concat(b), []))
      .do(arr => {
        this.appService.hideLoading();
        arr.slice(0).slice(- limit);
      })
      .subscribe(supplies => {
        this.products = supplies;
        this.rowProducts = supplies;
      });
  }

  getSupplyForDist(limit: number = 5): void {
    this.storeService
      .getSupplyList(this.authService.currentUserId, this.store._name)
      .take(1)
      .map(data => data.slice(0).slice(-limit))
      .do(e => this.appService.hideLoading())
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
    }

    this.getProductsForSupply(limit);
  }

  supplyItem(product: any): void {
    this.appService.showAlert('Please confirm to supply', [{
      text: 'ok',
      handler: () => this.updateSupplyItem(product)
    }, 'cancel'], this.store.name);
  }

  updateSupplyItem(product: any, uid: string = this.authService.currentUserId): Promise<any> {
    product.supply_date = this.appService.getCurrentDate(true);
    product.supply_status = 'supplied';
    product.supplied_by = uid;
    // update data
    return Promise.all([
      this.storeService.updateSupplyItem(this.store._name, product), this.storeService.addSupplyToPayment(this.store._name, product)
    ]);
  }

  getComments(): void {
    this.myUserService.getDistComments(this.store._name)
      .map(data => data
        .reduce((a, b) => a.concat(b), [])
        .slice(0).slice(-5)
      )
      .subscribe(messages => {
        this.commits = messages;
      });
  }

  submitCommit(event: any, uid: string = this.authService.currentUserId): void {
    let value = event.target.value;
    let data = {};
    data['uid'] = uid;
    data['message'] = value;
    data['date'] = this.appService.getCurrentDate(true);
    // update data
    this.storeService.submitCommonCommit(data, this.store._name);
    this.comment = '';
    this.getComments();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
