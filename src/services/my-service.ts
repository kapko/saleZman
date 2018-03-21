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
    return this.db.list(this.myStockPath + userId)
      .snapshotChanges()
      .map(changes => this.getKeys(changes));
  }

  getPaymentData(userId: string = this.storeService.userId): Observable<any> {
    return this.db.list(this.myPaymentPath + userId)
      .snapshotChanges()
      .map(changes => this.getKeys(changes));
  }

  getOrderedData(userId: string = this.storeService.userId): Observable<any> {
    return this.db.list(this.myOrderedPath + userId)
      .snapshotChanges()
      .map(changes => this.getKeys(changes));
  }

  getSupplyData(userId: string = this.storeService.userId): Observable<any> {
    return this.db.list(this.mySupplyPath + userId)
      .snapshotChanges()
      .map(changes => this.getKeys(changes));
  }

  getKeys(data): any {
    return data.map(c => ({ key: c.payload.key, ...c.payload.val() }));
  }

}
