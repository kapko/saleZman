import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app-service';
import { StoreService } from './store.service';

@Injectable()
export class MyService {
  userId: string = this.storeService.userId;

  mySuppliedDataPath: string = '/my-work-supply/';

  myPaidDataPath: string = '/my-work-paid/';

  myOrderedDataPath: string = '/my-work-ordered/';

  myPaymentDataPath: string = '/my-work-payment/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private storeService: StoreService,
  ) { }

  getMySuppliedData(): Observable<any> {
    return this.db.list(this.mySuppliedDataPath + this.userId).valueChanges();
  }

  getMyPaidData(): Observable<any> {
    return this.db.list(this.myPaidDataPath + this.userId).valueChanges();
  }

  getMyOrderedData(): Observable<any> {
    return this.db.list(this.myOrderedDataPath + this.userId).valueChanges();
  }

  getMyPaymentData(): Observable<any> {
    return this.db.list(this.myPaymentDataPath + this.userId).valueChanges();
  }

}
