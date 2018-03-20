import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app-service';
import { StoreService } from './store.service';

@Injectable()
export class MyService {
  userId: string = this.storeService.userId;

  myStockPath: string = '/my-work-stock/';

  myPaymentPath: string = '/my-work-payment/';

  myOrderedPath: string = '/my-work-ordered/';

  mySupplyPath: string = '/my-work-supply/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private storeService: StoreService,
  ) { }

  getStockData(): Observable<any> {
    return this.db.list(this.myStockPath + this.userId).snapshotChanges();
  }

  // .map(changes => 
  //   changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
  // )

  getPaymentData(): Observable<any> {
    return this.db.list(this.myPaymentPath + this.userId).snapshotChanges();
  }

  getOrderedData(): Observable<any> {
    return this.db.list(this.myOrderedPath + this.userId).snapshotChanges();
  }

  getSupplyData(): Observable<any> {
    return this.db.list(this.mySupplyPath + this.userId).snapshotChanges();
  }

}
