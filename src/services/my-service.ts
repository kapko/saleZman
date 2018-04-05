import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class MyService {
  userId: string;

  myStockPath: string = '/my-work-stock/';

  myPaymentPath: string = '/my-work-payment/';

  myOrderedPath: string = '/my-work-ordered/';

  mySupplyPath: string = '/my-work-supply/';

  activityStockPath: string = '/activities/stock/';

  activityOrderPath: string = '/activities/order/';

  activitySupplyPath: string = '/activities/supply/';

  activityPaymentPath: string = '/activities/payment/';

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
  ) { }

  getStockData(userId: string | null): Observable<any> {
    return this.db.list(this.myStockPath+this.getUserId(userId)).valueChanges();
  }

  getPaymentData(userId: string | null): Observable<any> {
    return this.db.list(this.myPaymentPath+this.getUserId(userId)).valueChanges();
  }

  getOrderedData(userId: string | null): Observable<any> {
    return this.db.list(this.myOrderedPath+this.getUserId(userId)).valueChanges();
  }

  getSupplyData(userId: string | null): Observable<any> {
    return this.db.list(this.mySupplyPath+this.getUserId(userId)).valueChanges();
  }

  getUserId(userId: string | null): string {
    return (userId) ? userId : this.authService.currentUserId;
   }

  getStockActivity(userId: string): Observable<any> {
    return this.db.list(`${this.activityStockPath}${userId}`).valueChanges();
  }

  getOrderActivity(userId: string): Observable<any> {
    return this.db.list(`${this.activityOrderPath}${userId}`).valueChanges();
  }

  getPaymentActivity(userId: string): Observable<any> {
    return this.db.list(`${this.activityPaymentPath}${userId}`).valueChanges();
  }

  getSupplyActivity(userId: string): Observable<any> {
    return this.db.list(`${this.activitySupplyPath}${userId}`).valueChanges();
  }

}
