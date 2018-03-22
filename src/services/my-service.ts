import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app-service';
import { StoreService } from './store.service';

@Injectable()
export class MyService {
  userId: string;

  myStockPath: string = '/my-work-stock/';

  myPaymentPath: string = '/my-work-payment/';

  myOrderedPath: string = '/my-work-ordered/';

  mySupplyPath: string = '/my-work-supply/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private storeService: StoreService,
  ) { }

  getStockData(userId: string = this.storeService.userId): Observable<any> {
    return this.db.list(this.myStockPath + userId).valueChanges();
  }

  getPaymentData(userId: string = this.storeService.userId): Observable<any> {
    return this.db.list(this.myPaymentPath + userId).valueChanges();
  }

  getOrderedData(userId: string = this.storeService.userId): Observable<any> {
    return this.db.list(this.myOrderedPath + userId).valueChanges();
  }

  getSupplyData(userId: string = this.storeService.userId): Observable<any> {
    return this.db.list(this.mySupplyPath + userId).valueChanges();
  }

}
